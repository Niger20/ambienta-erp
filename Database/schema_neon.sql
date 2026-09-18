--
-- PostgreSQL database dump
--

\restrict 9YRhyBnTZvhwsqE2aWvWWOAm9gkYQ06g5fdwyU14txuwfk5m6UG76eVPXTo40Ks

-- Dumped from database version 17.11 (8a81ecb)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fn_actualizar_prestamo_al_pagar_cuota(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_actualizar_prestamo_al_pagar_cuota() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.Estado = 'PAGADA' AND OLD.Estado <> 'PAGADA' THEN
        UPDATE PrestamosEmpleados SET MontoPagado = MontoPagado + NEW.MontoCuota
        WHERE PrestamoID = NEW.PrestamoID;
        UPDATE PrestamosEmpleados SET Estado = 'PAGADO'
        WHERE PrestamoID = NEW.PrestamoID AND ROUND(Monto - MontoPagado, 2) <= 0;
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_acumular_beneficios(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_acumular_beneficios() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE v_divisor INT;
BEGIN
    IF NEW.Estado = 'APROBADO' AND (OLD.Estado IS DISTINCT FROM 'APROBADO') THEN
        SELECT CASE TipoPeriodo WHEN 'MENSUAL' THEN 12 WHEN 'QUINCENAL' THEN 24
               WHEN 'SEMANAL' THEN 52 ELSE 12 END
        INTO v_divisor FROM PeriodosPlanilla WHERE PeriodoID = NEW.PeriodoID;

        INSERT INTO AcumuladoDecimoPrimerMes
               (EmpleadoID, PeriodoID, SalarioBruto, MontoAcumulado, FechaGeneracion)
        VALUES (NEW.EmpleadoID, NEW.PeriodoID, NEW.SalarioBruto,
                ROUND(NEW.TotalIngresos / v_divisor, 2), CURRENT_DATE)
        ON CONFLICT (EmpleadoID, PeriodoID) DO UPDATE
            SET MontoAcumulado = ROUND(NEW.TotalIngresos / v_divisor, 2);

        INSERT INTO AcumuladoVacaciones
               (EmpleadoID, PeriodoID, DiasGanados, ValorDiaSalario, FechaGeneracion)
        VALUES (NEW.EmpleadoID, NEW.PeriodoID,
                ROUND(2.5 / (v_divisor / 12.0), 2),
                ROUND(NEW.SalarioBruto / 30.0, 2), CURRENT_DATE)
        ON CONFLICT (EmpleadoID, PeriodoID) DO UPDATE
            SET DiasGanados = ROUND(2.5 / (v_divisor / 12.0), 2),
                ValorDiaSalario = ROUND(NEW.SalarioBruto / 30.0, 2);

        INSERT INTO AcumuladoIndemnizacion
               (EmpleadoID, PeriodoID, SalarioBruto, MontoAcumulado, FechaGeneracion)
        VALUES (NEW.EmpleadoID, NEW.PeriodoID, NEW.SalarioBruto,
                ROUND(NEW.SalarioBruto / v_divisor, 2), CURRENT_DATE)
        ON CONFLICT (EmpleadoID, PeriodoID) DO UPDATE
            SET MontoAcumulado = ROUND(NEW.SalarioBruto / v_divisor, 2);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_asignar_consecutivo_venta(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_asignar_consecutivo_venta() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.TipoFactura = 'FISCAL' AND NEW.ConsecutivoFiscal IS NULL THEN
        NEW.ConsecutivoFiscal := 'F' || LPAD(nextval('consecutivo_fiscal_seq')::TEXT, 6, '0');
    ELSIF NEW.TipoFactura = 'NO_FISCAL' AND NEW.ConsecutivoNoFiscal IS NULL THEN
        NEW.ConsecutivoNoFiscal := 'S' || LPAD(nextval('consecutivo_no_fiscal_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_auditoria(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_usuario_id INT;
BEGIN
    BEGIN
        v_usuario_id := current_setting('app.usuario_id', true)::INT;
    EXCEPTION WHEN OTHERS THEN
        v_usuario_id := NULL;
    END;

    IF TG_OP = 'DELETE' THEN
        INSERT INTO Auditoria(UsuarioID, Tabla, Operacion, DatosAnteriores)
        VALUES (v_usuario_id, TG_TABLE_NAME, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO Auditoria(UsuarioID, Tabla, Operacion, DatosAnteriores, DatosNuevos)
        VALUES (v_usuario_id, TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO Auditoria(UsuarioID, Tabla, Operacion, DatosNuevos)
        VALUES (v_usuario_id, TG_TABLE_NAME, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: fn_calcular_horas_asistencia(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calcular_horas_asistencia() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE v_horas_jornada DECIMAL;
BEGIN
    IF NEW.HoraSalida IS NOT NULL AND NEW.HoraEntrada IS NOT NULL THEN
        NEW.HorasTrabajadas := ROUND(
            EXTRACT(EPOCH FROM (NEW.HoraSalida - NEW.HoraEntrada)) / 3600.0, 2);
        SELECT HorasDiariasJornada INTO v_horas_jornada
        FROM Empleados WHERE EmpleadoID = NEW.EmpleadoID;
        NEW.HorasExtra := GREATEST(NEW.HorasTrabajadas - COALESCE(v_horas_jornada, 8), 0);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_calcular_inss_laboral(numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calcular_inss_laboral(p_salario numeric) RETURNS numeric
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE v_tasa DECIMAL;
BEGIN
    SELECT TasaLaboral INTO v_tasa FROM ConfiguracionINSS
    WHERE Activo = TRUE ORDER BY FechaVigencia DESC LIMIT 1;
    RETURN ROUND(p_salario * COALESCE(v_tasa, 0.0700), 2);
END;
$$;


--
-- Name: fn_calcular_inss_patronal(numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calcular_inss_patronal(p_salario numeric) RETURNS numeric
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE v_tasa DECIMAL;
BEGIN
    SELECT TasaPatronal INTO v_tasa FROM ConfiguracionINSS
    WHERE Activo = TRUE ORDER BY FechaVigencia DESC LIMIT 1;
    RETURN ROUND(p_salario * COALESCE(v_tasa, 0.2150), 2);
END;
$$;


--
-- Name: fn_calcular_ir_mensual(numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_calcular_ir_mensual(p_salario_bruto_mensual numeric) RETURNS numeric
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_inss_mensual  DECIMAL;
    v_base_anual    DECIMAL;
    v_cuota_fija    DECIMAL;
    v_tasa_marginal DECIMAL;
    v_desde         DECIMAL;
    v_ir_anual      DECIMAL;
    v_vigencia      DATE;
BEGIN
    v_inss_mensual := fn_calcular_inss_laboral(p_salario_bruto_mensual);
    v_base_anual   := (p_salario_bruto_mensual - v_inss_mensual) * 12;
    SELECT MAX(FechaVigencia) INTO v_vigencia FROM TablaTramoIR WHERE Activo = TRUE;
    SELECT CuotaFija, TasaMarginal, SalarioDesde
    INTO   v_cuota_fija, v_tasa_marginal, v_desde
    FROM   TablaTramoIR
    WHERE  Activo = TRUE AND FechaVigencia = v_vigencia
      AND  v_base_anual >= SalarioDesde
      AND  (SalarioHasta IS NULL OR v_base_anual <= SalarioHasta)
    LIMIT  1;
    IF NOT FOUND THEN RETURN 0; END IF;
    v_ir_anual := v_cuota_fija + ((v_base_anual - v_desde) * v_tasa_marginal);
    RETURN GREATEST(ROUND(v_ir_anual / 12, 2), 0);
END;
$$;


--
-- Name: fn_desactivar_empleado_liquidacion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_desactivar_empleado_liquidacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.Estado = 'PAGADO' AND OLD.Estado <> 'PAGADO' THEN
        UPDATE Empleados
        SET Estado = FALSE, FechaSalida = COALESCE(FechaSalida, NEW.FechaLiquidacion)
        WHERE EmpleadoID = NEW.EmpleadoID;
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_generar_cuotas_prestamo(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_generar_cuotas_prestamo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    i             INT;
    v_fecha_cuota DATE;
BEGIN
    FOR i IN 1..NEW.NumeroCuotas LOOP
        v_fecha_cuota := (NEW.FechaDesembolso + (i * INTERVAL '1 month'))::DATE;
        INSERT INTO CuotasPrestamos (PrestamoID, NumeroCuota, MontoCuota, FechaVencimiento)
        VALUES (NEW.PrestamoID, i, NEW.MontoCuota, v_fecha_cuota);
    END LOOP;
    RETURN NEW;
END;
$$;


--
-- Name: fn_historial_salario(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_historial_salario() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE v_usuario_id INT;
BEGIN
    IF NEW.SalarioBase <> OLD.SalarioBase THEN
        BEGIN
            v_usuario_id := current_setting('app.usuario_id', true)::INT;
        EXCEPTION WHEN OTHERS THEN v_usuario_id := NULL; END;
        INSERT INTO HistorialSalarios (EmpleadoID, SalarioAnterior, SalarioNuevo, UsuarioID)
        VALUES (NEW.EmpleadoID, OLD.SalarioBase, NEW.SalarioBase, v_usuario_id);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_salario_diario(numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_salario_diario(p_salario_mensual numeric) RETURNS numeric
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
    RETURN ROUND(p_salario_mensual / 30.0, 2);
END;
$$;


--
-- Name: fn_salario_hora(numeric, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_salario_hora(p_salario_mensual numeric, p_horas_diarias numeric DEFAULT 8) RETURNS numeric
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
    RETURN ROUND(p_salario_mensual / (30.0 * p_horas_diarias), 2);
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: abonos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abonos (
    abonoid integer NOT NULL,
    cuentaid integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    monto numeric(12,4) NOT NULL,
    metodopago character varying(50)
);


--
-- Name: abonos_abonoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.abonos ALTER COLUMN abonoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.abonos_abonoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: acumuladodecimoprimermes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.acumuladodecimoprimermes (
    acumuladodecimoid integer NOT NULL,
    empleadoid integer NOT NULL,
    periodoid integer NOT NULL,
    salariobruto numeric(12,4) NOT NULL,
    montoacumulado numeric(12,4) NOT NULL,
    montopagado numeric(12,4) DEFAULT 0 NOT NULL,
    fechageneracion date NOT NULL
);


--
-- Name: acumuladodecimoprimermes_acumuladodecimoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.acumuladodecimoprimermes ALTER COLUMN acumuladodecimoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.acumuladodecimoprimermes_acumuladodecimoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: acumuladoindemnizacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.acumuladoindemnizacion (
    acumuladoindemnid integer NOT NULL,
    empleadoid integer NOT NULL,
    periodoid integer NOT NULL,
    salariobruto numeric(12,4) NOT NULL,
    montoacumulado numeric(12,4) NOT NULL,
    fechageneracion date NOT NULL
);


--
-- Name: acumuladoindemnizacion_acumuladoindemnid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.acumuladoindemnizacion ALTER COLUMN acumuladoindemnid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.acumuladoindemnizacion_acumuladoindemnid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: acumuladovacaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.acumuladovacaciones (
    acumuladovacid integer NOT NULL,
    empleadoid integer NOT NULL,
    periodoid integer NOT NULL,
    diasganados numeric(6,2) DEFAULT 2.50 NOT NULL,
    valordiasalario numeric(12,4) NOT NULL,
    diasdisfrutados numeric(6,2) DEFAULT 0 NOT NULL,
    montopagado numeric(12,4) DEFAULT 0 NOT NULL,
    fechageneracion date NOT NULL,
    montoganado numeric(12,4) GENERATED ALWAYS AS ((diasganados * valordiasalario)) STORED
);


--
-- Name: acumuladovacaciones_acumuladovacid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.acumuladovacaciones ALTER COLUMN acumuladovacid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.acumuladovacaciones_acumuladovacid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: anticipossalario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anticipossalario (
    anticipoid integer NOT NULL,
    empleadoid integer NOT NULL,
    monto numeric(12,4) NOT NULL,
    fechaanticipoid date NOT NULL,
    descontadoenperiodoid integer,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    usuarioid integer,
    CONSTRAINT anticipossalario_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'DESCONTADO'::character varying])::text[]))),
    CONSTRAINT anticipossalario_monto_check CHECK ((monto > (0)::numeric))
);


--
-- Name: anticipossalario_anticipoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.anticipossalario ALTER COLUMN anticipoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.anticipossalario_anticipoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auditoria (
    auditoriaid integer NOT NULL,
    usuarioid integer,
    tabla character varying(100) NOT NULL,
    operacion character varying(10) NOT NULL,
    datosanteriores jsonb,
    datosnuevos jsonb,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auditoria_operacion_check CHECK (((operacion)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


--
-- Name: auditoria_auditoriaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auditoria ALTER COLUMN auditoriaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.auditoria_auditoriaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: autorizaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.autorizaciones (
    autorizacionid integer NOT NULL,
    usuarioid integer NOT NULL,
    accion character varying(100) NOT NULL,
    detalle character varying(255),
    codigo character varying(10),
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: autorizaciones_autorizacionid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.autorizaciones ALTER COLUMN autorizacionid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.autorizaciones_autorizacionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cargosempleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cargosempleados (
    cargoid integer NOT NULL,
    departamentoid integer,
    nombre character varying(100) NOT NULL,
    descripcion text,
    salariominimoreferencial numeric(12,4),
    salariomaximoreferencial numeric(12,4),
    estado boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_rango_salarial CHECK (((salariomaximoreferencial IS NULL) OR (salariomaximoreferencial >= salariominimoreferencial)))
);


--
-- Name: cargosempleados_cargoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cargosempleados ALTER COLUMN cargoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cargosempleados_cargoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categoriasclientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoriasclientes (
    categoriaclienteid integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    porcentajedescuento numeric(5,2) DEFAULT 0
);


--
-- Name: categoriasclientes_categoriaclienteid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.categoriasclientes ALTER COLUMN categoriaclienteid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categoriasclientes_categoriaclienteid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: categoriasproductos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoriasproductos (
    categoriaid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


--
-- Name: categoriasproductos_categoriaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.categoriasproductos ALTER COLUMN categoriaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categoriasproductos_categoriaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes (
    clienteid integer NOT NULL,
    categoriaclienteid integer,
    nombre character varying(100) NOT NULL,
    tipocliente character varying(20) DEFAULT 'NATURAL'::character varying NOT NULL,
    cedula character varying(20),
    ruc character varying(20),
    telefono character varying(15),
    direccion text,
    ubicaciongeografica character varying(255),
    limitecredito numeric(12,4),
    CONSTRAINT clientes_tipocliente_check CHECK (((tipocliente)::text = ANY ((ARRAY['NATURAL'::character varying, 'JURIDICO'::character varying])::text[])))
);


--
-- Name: clientes_clienteid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.clientes ALTER COLUMN clienteid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clientes_clienteid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: compras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compras (
    compraid integer NOT NULL,
    proveedorid integer NOT NULL,
    ordencompraid integer,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total numeric(12,4) NOT NULL,
    metodopago character varying(50) NOT NULL,
    tipocompra character varying(50) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    facturaproveedor character varying(100),
    CONSTRAINT compras_tipocompra_check CHECK (((tipocompra)::text = ANY ((ARRAY['CREDITO'::character varying, 'CONTADO'::character varying])::text[])))
);


--
-- Name: compras_compraid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.compras ALTER COLUMN compraid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.compras_compraid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: comprasproductos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprasproductos (
    compraid integer NOT NULL,
    productoid integer NOT NULL,
    cantidad numeric(12,4) NOT NULL,
    preciounitario numeric(12,4) NOT NULL,
    descuento numeric(12,4) DEFAULT 0,
    numerolote character varying(50),
    totalproducto numeric(12,4) GENERATED ALWAYS AS (((preciounitario * cantidad) - descuento)) STORED,
    CONSTRAINT comprasproductos_cantidad_check CHECK ((cantidad > (0)::numeric))
);


--
-- Name: configuracioninss; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracioninss (
    configinssid integer NOT NULL,
    tasalaboral numeric(5,4) NOT NULL,
    tasapatronal numeric(5,4) NOT NULL,
    fechavigencia date NOT NULL,
    fechafinvigencia date,
    activo boolean DEFAULT true NOT NULL,
    observaciones text
);


--
-- Name: configuracioninss_configinssid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.configuracioninss ALTER COLUMN configinssid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.configuracioninss_configinssid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: consecutivo_fiscal_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consecutivo_fiscal_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consecutivo_no_fiscal_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consecutivo_no_fiscal_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: costosadicionalescompras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.costosadicionalescompras (
    costoadicionalid integer NOT NULL,
    compraid integer NOT NULL,
    concepto character varying(100) NOT NULL,
    monto numeric(12,4) NOT NULL,
    CONSTRAINT costosadicionalescompras_monto_check CHECK ((monto >= (0)::numeric))
);


--
-- Name: costosadicionalescompras_costoadicionalid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.costosadicionalescompras ALTER COLUMN costoadicionalid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.costosadicionalescompras_costoadicionalid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cuentasporcobrar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cuentasporcobrar (
    cuentaid integer NOT NULL,
    ventaid integer NOT NULL,
    clienteid integer NOT NULL,
    montototal numeric(12,4) NOT NULL,
    montopagado numeric(12,4) DEFAULT 0,
    fechavencimiento date NOT NULL,
    estado character varying(50) NOT NULL,
    montorestante numeric(12,4) GENERATED ALWAYS AS ((montototal - montopagado)) STORED,
    CONSTRAINT cuentasporcobrar_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PAGADO'::character varying, 'VENCIDO'::character varying])::text[])))
);


--
-- Name: cuentasporcobrar_cuentaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cuentasporcobrar ALTER COLUMN cuentaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cuentasporcobrar_cuentaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cuentasporpagar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cuentasporpagar (
    cuentapagarid integer NOT NULL,
    compraid integer NOT NULL,
    montototal numeric(12,4) NOT NULL,
    montopagado numeric(12,4) DEFAULT 0,
    cuotas integer,
    montocuota numeric(12,4),
    fechacuota integer,
    fechavencimiento date NOT NULL,
    estado character varying(50) NOT NULL,
    montorestante numeric(12,4) GENERATED ALWAYS AS ((montototal - montopagado)) STORED,
    CONSTRAINT cuentasporpagar_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PAGADO'::character varying, 'VENCIDO'::character varying])::text[])))
);


--
-- Name: cuentasporpagar_cuentapagarid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cuentasporpagar ALTER COLUMN cuentapagarid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cuentasporpagar_cuentapagarid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cuotasprestamos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cuotasprestamos (
    cuotaid integer NOT NULL,
    prestamoid integer NOT NULL,
    numerocuota integer NOT NULL,
    montocuota numeric(12,4) NOT NULL,
    fechavencimiento date NOT NULL,
    fechapago date,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    detalleid integer,
    CONSTRAINT cuotasprestamos_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PAGADA'::character varying, 'VENCIDA'::character varying])::text[]))),
    CONSTRAINT cuotasprestamos_montocuota_check CHECK ((montocuota > (0)::numeric))
);


--
-- Name: cuotasprestamos_cuotaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cuotasprestamos ALTER COLUMN cuotaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cuotasprestamos_cuotaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deliveries (
    deliveryid integer NOT NULL,
    repartidorid integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    direccionentrega text NOT NULL,
    costo numeric(12,4) NOT NULL,
    estado boolean DEFAULT true
);


--
-- Name: deliveries_deliveryid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.deliveries ALTER COLUMN deliveryid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.deliveries_deliveryid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: departamentosempleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departamentosempleados (
    departamentoid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    jefeempleadoid integer,
    estado boolean DEFAULT true NOT NULL
);


--
-- Name: departamentosempleados_departamentoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.departamentosempleados ALTER COLUMN departamentoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.departamentosempleados_departamentoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: devoluciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.devoluciones (
    devolucionid integer NOT NULL,
    ventaid integer NOT NULL,
    productoid integer NOT NULL,
    cantidad numeric(12,4) NOT NULL,
    motivo text NOT NULL,
    montodevuelto numeric(12,4) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuarioid integer NOT NULL,
    CONSTRAINT devoluciones_cantidad_check CHECK ((cantidad > (0)::numeric)),
    CONSTRAINT devoluciones_montodevuelto_check CHECK ((montodevuelto >= (0)::numeric))
);


--
-- Name: devoluciones_devolucionid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.devoluciones ALTER COLUMN devolucionid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.devoluciones_devolucionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: empleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empleados (
    empleadoid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    cedula character varying(20) NOT NULL,
    fechanacimiento date,
    sexo character(1),
    telefono character varying(20),
    email character varying(100),
    direcciondomicilio text,
    departamentoid integer,
    cargoid integer,
    cargo character varying(100) NOT NULL,
    tipocontrato character varying(30) NOT NULL,
    tipojornada character varying(10) DEFAULT 'DIURNA'::character varying NOT NULL,
    horasdiariasjornada numeric(4,2) DEFAULT 8.00 NOT NULL,
    salariobase numeric(12,4) NOT NULL,
    tipopago character varying(20) DEFAULT 'MENSUAL'::character varying NOT NULL,
    numeroinss character varying(20),
    banco character varying(100),
    cuentabancaria character varying(50),
    tipocuenta character varying(20),
    fechaingreso date NOT NULL,
    fechasalida date,
    motivosalida character varying(100),
    estado boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_inss_planilla CHECK ((((tipocontrato)::text = 'PLANILLA'::text) OR (((tipocontrato)::text = 'SERVICIOS_PROFESIONALES'::text) AND (numeroinss IS NULL)))),
    CONSTRAINT empleados_sexo_check CHECK ((sexo = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))),
    CONSTRAINT empleados_tipocontrato_check CHECK (((tipocontrato)::text = ANY ((ARRAY['PLANILLA'::character varying, 'SERVICIOS_PROFESIONALES'::character varying])::text[]))),
    CONSTRAINT empleados_tipocuenta_check CHECK (((tipocuenta)::text = ANY ((ARRAY['CORRIENTE'::character varying, 'AHORROS'::character varying])::text[]))),
    CONSTRAINT empleados_tipojornada_check CHECK (((tipojornada)::text = ANY ((ARRAY['DIURNA'::character varying, 'NOCTURNA'::character varying, 'MIXTA'::character varying])::text[]))),
    CONSTRAINT empleados_tipopago_check CHECK (((tipopago)::text = ANY ((ARRAY['MENSUAL'::character varying, 'QUINCENAL'::character varying, 'SEMANAL'::character varying])::text[])))
);


--
-- Name: empleados_empleadoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.empleados ALTER COLUMN empleadoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empleados_empleadoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empresa (
    empresaid integer NOT NULL,
    nombreempresa character varying(100),
    direccion text,
    telefono character varying(15),
    ruc character varying(50),
    logourl character varying(255),
    tasacambio numeric(12,4)
);


--
-- Name: empresa_empresaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.empresa ALTER COLUMN empresaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empresa_empresaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feriadosnacionales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feriadosnacionales (
    feriadoid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha date NOT NULL,
    esrecurrente boolean DEFAULT true NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: feriadosnacionales_feriadoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.feriadosnacionales ALTER COLUMN feriadoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.feriadosnacionales_feriadoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: gastos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gastos (
    gastoid integer NOT NULL,
    usuarioid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


--
-- Name: gastos_gastoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.gastos ALTER COLUMN gastoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gastos_gastoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historialsalarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historialsalarios (
    historialid integer NOT NULL,
    empleadoid integer NOT NULL,
    salarioanterior numeric(12,4) NOT NULL,
    salarionuevo numeric(12,4) NOT NULL,
    fechacambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motivo text,
    usuarioid integer
);


--
-- Name: historialsalarios_historialid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.historialsalarios ALTER COLUMN historialid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historialsalarios_historialid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: imagenesproductos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imagenesproductos (
    imagenid integer NOT NULL,
    productoid integer NOT NULL,
    urlimagen character varying(255) NOT NULL,
    esprincipal boolean DEFAULT false NOT NULL
);


--
-- Name: imagenesproductos_imagenid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.imagenesproductos ALTER COLUMN imagenid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.imagenesproductos_imagenid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: liquidacionesempleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.liquidacionesempleados (
    liquidacionid integer NOT NULL,
    empleadoid integer NOT NULL,
    fechaliquidacion date NOT NULL,
    tiposalida character varying(30) NOT NULL,
    salariobrutobase numeric(12,4) NOT NULL,
    diaslaborados integer NOT NULL,
    vacacionespagadas numeric(12,4) DEFAULT 0 NOT NULL,
    decimotercerpagado numeric(12,4) DEFAULT 0 NOT NULL,
    indemnizacionpagada numeric(12,4) DEFAULT 0 NOT NULL,
    salariosatrasados numeric(12,4) DEFAULT 0 NOT NULL,
    otrosbeneficios numeric(12,4) DEFAULT 0 NOT NULL,
    prestamosdescontados numeric(12,4) DEFAULT 0 NOT NULL,
    anticiposdescontados numeric(12,4) DEFAULT 0 NOT NULL,
    otrasdeduccionesliq numeric(12,4) DEFAULT 0 NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    usuarioid integer,
    observaciones text,
    totalbruto numeric(12,4) GENERATED ALWAYS AS (((((vacacionespagadas + decimotercerpagado) + indemnizacionpagada) + salariosatrasados) + otrosbeneficios)) STORED,
    totaldescuentos numeric(12,4) GENERATED ALWAYS AS (((prestamosdescontados + anticiposdescontados) + otrasdeduccionesliq)) STORED,
    montoneto numeric(12,4) GENERATED ALWAYS AS ((((((vacacionespagadas + decimotercerpagado) + indemnizacionpagada) + salariosatrasados) + otrosbeneficios) - ((prestamosdescontados + anticiposdescontados) + otrasdeduccionesliq))) STORED,
    CONSTRAINT liquidacionesempleados_estado_check CHECK (((estado)::text = ANY ((ARRAY['BORRADOR'::character varying, 'APROBADO'::character varying, 'PAGADO'::character varying])::text[]))),
    CONSTRAINT liquidacionesempleados_tiposalida_check CHECK (((tiposalida)::text = ANY ((ARRAY['RENUNCIA'::character varying, 'DESPIDO_JUSTIFICADO'::character varying, 'DESPIDO_INJUSTIFICADO'::character varying, 'MUTUO_ACUERDO'::character varying, 'FALLECIMIENTO'::character varying])::text[])))
);


--
-- Name: liquidacionesempleados_liquidacionid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.liquidacionesempleados ALTER COLUMN liquidacionid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.liquidacionesempleados_liquidacionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mermas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mermas (
    mermaid integer NOT NULL,
    productoid integer NOT NULL,
    cantidad numeric(12,4) NOT NULL,
    costounitario numeric(12,4) NOT NULL,
    motivo text NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuarioid integer NOT NULL,
    movimientoid integer,
    costoperdida numeric(12,4) GENERATED ALWAYS AS ((cantidad * costounitario)) STORED,
    productodestinoid integer,
    cantidaddestino numeric(10,2),
    movimientoingresoid integer,
    CONSTRAINT mermas_cantidad_check CHECK ((cantidad > (0)::numeric))
);


--
-- Name: mermas_mermaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mermas ALTER COLUMN mermaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.mermas_mermaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movimientoscompras; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimientoscompras (
    movimientocompraid integer NOT NULL,
    compraid integer NOT NULL
);


--
-- Name: movimientosinventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimientosinventario (
    movimientoid integer NOT NULL,
    productoid integer NOT NULL,
    tipomovimiento character varying(50) NOT NULL,
    cantidad numeric(12,4) NOT NULL,
    numerolote character varying(50),
    stockanterior numeric(12,4) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motivo text,
    stockresultante numeric(12,4) GENERATED ALWAYS AS ((stockanterior + cantidad)) STORED,
    CONSTRAINT movimientosinventario_tipomovimiento_check CHECK (((tipomovimiento)::text = ANY ((ARRAY['INGRESO'::character varying, 'EGRESO'::character varying, 'AJUSTE'::character varying, 'MERMA'::character varying, 'DEVOLUCION'::character varying])::text[])))
);


--
-- Name: movimientosinventario_movimientoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.movimientosinventario ALTER COLUMN movimientoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movimientosinventario_movimientoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movimientoventas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimientoventas (
    movimeintoventaid integer NOT NULL,
    ventaid integer NOT NULL
);


--
-- Name: ordenescompra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ordenescompra (
    ordencompraid integer NOT NULL,
    proveedorid integer NOT NULL,
    fechaorden timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fechaesperada date,
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    CONSTRAINT ordenescompra_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'RECIBIDA_PARCIAL'::character varying, 'RECIBIDA_TOTAL'::character varying, 'CANCELADA'::character varying])::text[])))
);


--
-- Name: ordenescompra_ordencompraid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ordenescompra ALTER COLUMN ordencompraid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ordenescompra_ordencompraid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ordenescompraproductos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ordenescompraproductos (
    ordencompraid integer NOT NULL,
    productoid integer NOT NULL,
    cantidadordenada numeric(12,4) NOT NULL,
    preciounitario numeric(12,4) NOT NULL,
    CONSTRAINT ordenescompraproductos_cantidadordenada_check CHECK ((cantidadordenada > (0)::numeric))
);


--
-- Name: pagocuentasporpagar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagocuentasporpagar (
    pagoid integer NOT NULL,
    cuentapagarid integer NOT NULL
);


--
-- Name: pagogastos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagogastos (
    pagoid integer NOT NULL,
    gastoid integer NOT NULL
);


--
-- Name: pagos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagos (
    pagoid integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    monto numeric(12,4) NOT NULL,
    metodopago character varying(50) DEFAULT 'Efectivo'::character varying,
    estado boolean DEFAULT false
);


--
-- Name: pagos_pagoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.pagos ALTER COLUMN pagoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pagos_pagoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pagosbeneficios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pagosbeneficios (
    pagobeneficioid integer NOT NULL,
    empleadoid integer NOT NULL,
    tipobeneficio character varying(30) NOT NULL,
    montopagado numeric(12,4) NOT NULL,
    fechapago date NOT NULL,
    periodoid integer,
    observaciones text,
    usuarioid integer,
    CONSTRAINT pagosbeneficios_montopagado_check CHECK ((montopagado > (0)::numeric)),
    CONSTRAINT pagosbeneficios_tipobeneficio_check CHECK (((tipobeneficio)::text = ANY ((ARRAY['DECIMO_TERCER_MES'::character varying, 'VACACIONES'::character varying, 'INDEMNIZACION'::character varying])::text[])))
);


--
-- Name: pagosbeneficios_pagobeneficioid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.pagosbeneficios ALTER COLUMN pagobeneficioid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pagosbeneficios_pagobeneficioid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: periodosplanilla; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periodosplanilla (
    periodoid integer NOT NULL,
    tipoperiodo character varying(20) DEFAULT 'MENSUAL'::character varying NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    fechapago date,
    estado character varying(20) DEFAULT 'ABIERTO'::character varying NOT NULL,
    observaciones text,
    usuarioaprobacionid integer,
    fechaaprobacion timestamp without time zone,
    CONSTRAINT chk_fechas_periodo CHECK ((fechafin >= fechainicio)),
    CONSTRAINT periodosplanilla_estado_check CHECK (((estado)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_REVISION'::character varying, 'APROBADO'::character varying, 'PAGADO'::character varying, 'CERRADO'::character varying])::text[]))),
    CONSTRAINT periodosplanilla_tipoperiodo_check CHECK (((tipoperiodo)::text = ANY ((ARRAY['MENSUAL'::character varying, 'QUINCENAL'::character varying, 'SEMANAL'::character varying])::text[])))
);


--
-- Name: periodosplanilla_periodoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.periodosplanilla ALTER COLUMN periodoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.periodosplanilla_periodoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planilladeducciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planilladeducciones (
    deduccionplanillaid integer NOT NULL,
    detalleid integer NOT NULL,
    concepto character varying(100) NOT NULL,
    monto numeric(12,4) NOT NULL,
    CONSTRAINT planilladeducciones_monto_check CHECK ((monto > (0)::numeric))
);


--
-- Name: planilladeducciones_deduccionplanillaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.planilladeducciones ALTER COLUMN deduccionplanillaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planilladeducciones_deduccionplanillaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planilladetalle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planilladetalle (
    detalleid integer NOT NULL,
    periodoid integer NOT NULL,
    empleadoid integer NOT NULL,
    salariobruto numeric(12,4) NOT NULL,
    montohorasextra numeric(12,4) DEFAULT 0 NOT NULL,
    comisiones numeric(12,4) DEFAULT 0 NOT NULL,
    pagoferiados numeric(12,4) DEFAULT 0 NOT NULL,
    otrosingresos numeric(12,4) DEFAULT 0 NOT NULL,
    insslaboral numeric(12,4) DEFAULT 0 NOT NULL,
    ir numeric(12,4) DEFAULT 0 NOT NULL,
    otrasdeducciones numeric(12,4) DEFAULT 0 NOT NULL,
    cuotasprestamos numeric(12,4) DEFAULT 0 NOT NULL,
    anticipos numeric(12,4) DEFAULT 0 NOT NULL,
    insspatronal numeric(12,4) DEFAULT 0 NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    observaciones text,
    totalingresos numeric(12,4) GENERATED ALWAYS AS (((((salariobruto + montohorasextra) + comisiones) + pagoferiados) + otrosingresos)) STORED,
    totaldeducciones numeric(12,4) GENERATED ALWAYS AS (((((insslaboral + ir) + otrasdeducciones) + cuotasprestamos) + anticipos)) STORED,
    salarioneto numeric(12,4) GENERATED ALWAYS AS ((((((salariobruto + montohorasextra) + comisiones) + pagoferiados) + otrosingresos) - ((((insslaboral + ir) + otrasdeducciones) + cuotasprestamos) + anticipos))) STORED,
    CONSTRAINT planilladetalle_estado_check CHECK (((estado)::text = ANY ((ARRAY['BORRADOR'::character varying, 'APROBADO'::character varying, 'PAGADO'::character varying])::text[])))
);


--
-- Name: planilladetalle_detalleid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.planilladetalle ALTER COLUMN detalleid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planilladetalle_detalleid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planillahorasextra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planillahorasextra (
    horasextraid integer NOT NULL,
    detalleid integer NOT NULL,
    fecha date NOT NULL,
    tipohora character varying(20) NOT NULL,
    horastrabajadas numeric(4,2) NOT NULL,
    tarifahora numeric(12,4) NOT NULL,
    porcentajerecargo numeric(5,2) NOT NULL,
    montohoraextra numeric(12,4) GENERATED ALWAYS AS (((horastrabajadas * tarifahora) * (porcentajerecargo / 100.0))) STORED,
    CONSTRAINT planillahorasextra_horastrabajadas_check CHECK ((horastrabajadas > (0)::numeric)),
    CONSTRAINT planillahorasextra_tipohora_check CHECK (((tipohora)::text = ANY ((ARRAY['DIURNA'::character varying, 'NOCTURNA'::character varying, 'FERIADO'::character varying])::text[])))
);


--
-- Name: planillahorasextra_horasextraid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.planillahorasextra ALTER COLUMN horasextraid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planillahorasextra_horasextraid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: prestamosempleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prestamosempleados (
    prestamoid integer NOT NULL,
    empleadoid integer NOT NULL,
    monto numeric(12,4) NOT NULL,
    montopagado numeric(12,4) DEFAULT 0 NOT NULL,
    numerocuotas integer NOT NULL,
    montocuota numeric(12,4) NOT NULL,
    fechadesembolso date NOT NULL,
    motivo text,
    estado character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    usuarioid integer,
    montorestante numeric(12,4) GENERATED ALWAYS AS ((monto - montopagado)) STORED,
    CONSTRAINT prestamosempleados_estado_check CHECK (((estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'PAGADO'::character varying, 'CANCELADO'::character varying])::text[]))),
    CONSTRAINT prestamosempleados_monto_check CHECK ((monto > (0)::numeric)),
    CONSTRAINT prestamosempleados_montocuota_check CHECK ((montocuota > (0)::numeric)),
    CONSTRAINT prestamosempleados_numerocuotas_check CHECK ((numerocuotas > 0))
);


--
-- Name: prestamosempleados_prestamoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.prestamosempleados ALTER COLUMN prestamoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.prestamosempleados_prestamoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: productos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.productos (
    productoid integer NOT NULL,
    codigobarra character varying(50),
    categoriaid integer,
    unidadmedidaid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    preciocompra numeric(12,4) NOT NULL,
    precioventa numeric(12,4) NOT NULL,
    preciomayoreo numeric(12,4),
    cantidadminimamayoreo numeric(12,4),
    stockminimo numeric(12,4) DEFAULT 0,
    stockactual numeric(12,4) DEFAULT 0,
    requierefechavencimiento boolean DEFAULT false NOT NULL,
    fechavencimiento date,
    publicadoencatalogo boolean DEFAULT false NOT NULL,
    utilidad numeric(12,4) GENERATED ALWAYS AS ((precioventa - preciocompra)) STORED,
    CONSTRAINT chk_fecha_vencimiento CHECK (((requierefechavencimiento = false) OR (fechavencimiento IS NOT NULL))),
    CONSTRAINT chk_precio_mayoreo CHECK ((((preciomayoreo IS NULL) AND (cantidadminimamayoreo IS NULL)) OR ((preciomayoreo IS NOT NULL) AND (cantidadminimamayoreo IS NOT NULL)))),
    CONSTRAINT productos_stockactual_check CHECK ((stockactual >= (0)::numeric)),
    CONSTRAINT productos_stockminimo_check CHECK ((stockminimo >= (0)::numeric))
);


--
-- Name: productos_productoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.productos ALTER COLUMN productoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.productos_productoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: proveedores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proveedores (
    proveedorid integer NOT NULL,
    nombreempresa character varying(100) NOT NULL,
    asesorventas character varying(100) NOT NULL,
    telefono character varying(15),
    direccion text,
    ubicaciongeografica character varying(255),
    clasificacion character varying(50)
);


--
-- Name: proveedores_proveedorid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.proveedores ALTER COLUMN proveedorid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.proveedores_proveedorid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: registroasistencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.registroasistencia (
    asistenciaid integer NOT NULL,
    empleadoid integer NOT NULL,
    fecha date NOT NULL,
    horaentrada time without time zone,
    horasalida time without time zone,
    horastrabajadas numeric(5,2),
    horasextra numeric(5,2) DEFAULT 0 NOT NULL,
    tipoausencia character varying(20),
    observaciones text,
    CONSTRAINT registroasistencia_tipoausencia_check CHECK (((tipoausencia)::text = ANY ((ARRAY['PERMISO'::character varying, 'ENFERMEDAD'::character varying, 'INJUSTIFICADA'::character varying, 'VACACION'::character varying, 'FERIADO'::character varying])::text[])))
);


--
-- Name: registroasistencia_asistenciaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.registroasistencia ALTER COLUMN asistenciaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.registroasistencia_asistenciaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: repartidores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repartidores (
    repartidorid integer NOT NULL,
    nombre character varying(100) NOT NULL,
    telefono character varying(15)
);


--
-- Name: repartidores_repartidorid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.repartidores ALTER COLUMN repartidorid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.repartidores_repartidorid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sesiones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sesiones (
    sesionid integer NOT NULL,
    usuarioid integer NOT NULL,
    fechainicio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fechafin timestamp without time zone,
    montoinicial numeric(12,4) NOT NULL,
    montofinalsistema numeric(12,4),
    montofinalfisico numeric(12,4)
);


--
-- Name: sesiones_sesionid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.sesiones ALTER COLUMN sesionid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sesiones_sesionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: solicitudesvacaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solicitudesvacaciones (
    solicitudvacid integer NOT NULL,
    empleadoid integer NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL,
    diashabiles numeric(6,2) NOT NULL,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    usuarioaprobacionid integer,
    fechaaprobacion timestamp without time zone,
    observaciones text,
    CONSTRAINT chk_fechas_vacacion CHECK ((fechafin >= fechainicio)),
    CONSTRAINT solicitudesvacaciones_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'APROBADA'::character varying, 'RECHAZADA'::character varying, 'DISFRUTADA'::character varying, 'CANCELADA'::character varying])::text[])))
);


--
-- Name: solicitudesvacaciones_solicitudvacid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.solicitudesvacaciones ALTER COLUMN solicitudvacid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.solicitudesvacaciones_solicitudvacid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tablatramoir; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tablatramoir (
    tramoirid integer NOT NULL,
    salariodesde numeric(12,2) NOT NULL,
    salariohasta numeric(12,2),
    cuotafija numeric(12,2) DEFAULT 0 NOT NULL,
    tasamarginal numeric(5,4) DEFAULT 0 NOT NULL,
    fechavigencia date NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


--
-- Name: tablatramoir_tramoirid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tablatramoir ALTER COLUMN tramoirid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tablatramoir_tramoirid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: unidadesmedida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unidadesmedida (
    unidadmedidaid integer NOT NULL,
    nombre character varying(50) NOT NULL,
    abreviatura character varying(10) NOT NULL,
    permitefraccionamiento boolean DEFAULT false NOT NULL
);


--
-- Name: unidadesmedida_unidadmedidaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.unidadesmedida ALTER COLUMN unidadmedidaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.unidadesmedida_unidadmedidaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    usuarioid integer NOT NULL,
    nombreusuario character varying(50) NOT NULL,
    contrasenahash character varying(255) NOT NULL,
    fecharegistro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rol character varying(50)
);


--
-- Name: usuarios_usuarioid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.usuarios ALTER COLUMN usuarioid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_usuarioid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: v_asistencia_resumen; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_asistencia_resumen AS
 SELECT e.empleadoid,
    (((e.nombre)::text || ' '::text) || (e.apellidos)::text) AS nombreempleado,
    dep.nombre AS departamento,
    ra.fecha,
    ra.horaentrada,
    ra.horasalida,
    ra.horastrabajadas,
    ra.horasextra,
    ra.tipoausencia,
    ra.observaciones
   FROM ((public.registroasistencia ra
     JOIN public.empleados e ON ((ra.empleadoid = e.empleadoid)))
     LEFT JOIN public.departamentosempleados dep ON ((e.departamentoid = dep.departamentoid)));


--
-- Name: v_costo_patronal_periodo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_costo_patronal_periodo AS
 SELECT pp.periodoid,
    pp.tipoperiodo,
    pp.fechainicio,
    pp.fechafin,
    pp.estado AS estadoperiodo,
    count(pd.detalleid) AS totalempleados,
    sum(pd.salariobruto) AS totalsalariosbrutos,
    sum(pd.totalingresos) AS totalingresos,
    sum(pd.insslaboral) AS totalinsslaboral,
    sum(pd.ir) AS totalir,
    sum(pd.totaldeducciones) AS totaldeducciones,
    sum(pd.salarioneto) AS totalsalariosnetos,
    sum(pd.insspatronal) AS totalinsspatronal,
    sum((pd.totalingresos + pd.insspatronal)) AS costototalempresa
   FROM (public.periodosplanilla pp
     JOIN public.planilladetalle pd ON ((pp.periodoid = pd.periodoid)))
  GROUP BY pp.periodoid, pp.tipoperiodo, pp.fechainicio, pp.fechafin, pp.estado;


--
-- Name: v_empleados_activos; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_empleados_activos AS
 SELECT e.empleadoid,
    e.nombre,
    e.apellidos,
    (((e.nombre)::text || ' '::text) || (e.apellidos)::text) AS nombrecompleto,
    e.cedula,
    e.cargo,
    dep.nombre AS departamento,
    car.nombre AS nombrecargo,
    e.tipocontrato,
    e.tipojornada,
    e.horasdiariasjornada,
    e.tipopago,
    e.salariobase,
    e.fechaingreso,
    (EXTRACT(year FROM age((CURRENT_DATE)::timestamp with time zone, (e.fechaingreso)::timestamp with time zone)))::integer AS anosservicio,
    (EXTRACT(month FROM age((CURRENT_DATE)::timestamp with time zone, (e.fechaingreso)::timestamp with time zone)))::integer AS mesesservicioadicionales,
    e.numeroinss,
    e.banco,
    e.cuentabancaria,
    e.tipocuenta,
    e.telefono,
    e.email
   FROM ((public.empleados e
     LEFT JOIN public.departamentosempleados dep ON ((e.departamentoid = dep.departamentoid)))
     LEFT JOIN public.cargosempleados car ON ((e.cargoid = car.cargoid)))
  WHERE (e.estado = true);


--
-- Name: v_planilla_completa; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_planilla_completa AS
 SELECT pd.detalleid,
    pp.periodoid,
    pp.tipoperiodo,
    pp.fechainicio,
    pp.fechafin,
    pp.fechapago,
    pp.estado AS estadoperiodo,
    e.empleadoid,
    (((e.nombre)::text || ' '::text) || (e.apellidos)::text) AS nombreempleado,
    e.cedula,
    e.cargo,
    e.tipocontrato,
    e.tipojornada,
    dep.nombre AS departamento,
    pd.salariobruto,
    pd.montohorasextra,
    pd.comisiones,
    pd.pagoferiados,
    pd.otrosingresos,
    pd.totalingresos,
    pd.insslaboral,
    pd.ir,
    pd.otrasdeducciones,
    pd.cuotasprestamos,
    pd.anticipos,
    pd.totaldeducciones,
    pd.salarioneto,
    pd.insspatronal,
    (pd.totalingresos + pd.insspatronal) AS costototalempresa,
    pd.estado AS estadodetalle,
    pd.observaciones
   FROM (((public.planilladetalle pd
     JOIN public.periodosplanilla pp ON ((pd.periodoid = pp.periodoid)))
     JOIN public.empleados e ON ((pd.empleadoid = e.empleadoid)))
     LEFT JOIN public.departamentosempleados dep ON ((e.departamentoid = dep.departamentoid)));


--
-- Name: v_prestamos_activos; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_prestamos_activos AS
 SELECT pr.prestamoid,
    e.empleadoid,
    (((e.nombre)::text || ' '::text) || (e.apellidos)::text) AS nombreempleado,
    pr.monto AS montooriginal,
    pr.montopagado,
    pr.montorestante,
    pr.numerocuotas,
    pr.montocuota,
    pr.fechadesembolso,
    pr.estado,
    count(cp.cuotaid) FILTER (WHERE ((cp.estado)::text = 'PENDIENTE'::text)) AS cuotaspendientes,
    count(cp.cuotaid) FILTER (WHERE ((cp.estado)::text = 'VENCIDA'::text)) AS cuotasvencidas,
    min(cp.fechavencimiento) FILTER (WHERE ((cp.estado)::text = 'PENDIENTE'::text)) AS proximafechavencimiento
   FROM ((public.prestamosempleados pr
     JOIN public.empleados e ON ((pr.empleadoid = e.empleadoid)))
     LEFT JOIN public.cuotasprestamos cp ON ((pr.prestamoid = cp.prestamoid)))
  WHERE ((pr.estado)::text = 'ACTIVO'::text)
  GROUP BY pr.prestamoid, e.empleadoid, e.nombre, e.apellidos, pr.monto, pr.montopagado, pr.montorestante, pr.numerocuotas, pr.montocuota, pr.fechadesembolso, pr.estado;


--
-- Name: v_saldos_beneficios_empleados; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.v_saldos_beneficios_empleados AS
 SELECT e.empleadoid,
    (((e.nombre)::text || ' '::text) || (e.apellidos)::text) AS nombreempleado,
    e.cargo,
    e.fechaingreso,
    COALESCE(sum(adm.montoacumulado), (0)::numeric) AS decimo_acumulado,
    COALESCE(sum(adm.montopagado), (0)::numeric) AS decimo_pagado,
    COALESCE((sum(adm.montoacumulado) - sum(adm.montopagado)), (0)::numeric) AS decimo_saldo,
    COALESCE(sum(av.diasganados), (0)::numeric) AS vacaciones_diasganados,
    COALESCE(sum(av.diasdisfrutados), (0)::numeric) AS vacaciones_diasdisfrutados,
    COALESCE((sum(av.diasganados) - sum(av.diasdisfrutados)), (0)::numeric) AS vacaciones_diassaldo,
    COALESCE(sum(av.montoganado), (0)::numeric) AS vacaciones_montoganado,
    COALESCE(sum(av.montopagado), (0)::numeric) AS vacaciones_montopagado,
    COALESCE(sum(ai.montoacumulado), (0)::numeric) AS indemnizacion_acumulada
   FROM (((public.empleados e
     LEFT JOIN public.acumuladodecimoprimermes adm ON ((e.empleadoid = adm.empleadoid)))
     LEFT JOIN public.acumuladovacaciones av ON ((e.empleadoid = av.empleadoid)))
     LEFT JOIN public.acumuladoindemnizacion ai ON ((e.empleadoid = ai.empleadoid)))
  WHERE (e.estado = true)
  GROUP BY e.empleadoid, e.nombre, e.apellidos, e.cargo, e.fechaingreso;


--
-- Name: ventadelivery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ventadelivery (
    ventaid integer NOT NULL,
    deliveryid integer NOT NULL
);


--
-- Name: ventapagos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ventapagos (
    ventapagoid integer NOT NULL,
    ventaid integer NOT NULL,
    metodopago character varying(20) NOT NULL,
    monto numeric(12,4) NOT NULL,
    banco character varying(100),
    numerotransferencia character varying(50),
    CONSTRAINT chk_banco_requerido CHECK (((((metodopago)::text = 'EFECTIVO'::text) AND (banco IS NULL)) OR (((metodopago)::text = ANY ((ARRAY['TARJETA'::character varying, 'TRANSFERENCIA'::character varying])::text[])) AND (banco IS NOT NULL)))),
    CONSTRAINT chk_numero_transferencia CHECK (((((metodopago)::text = 'TRANSFERENCIA'::text) AND (numerotransferencia IS NOT NULL)) OR (((metodopago)::text <> 'TRANSFERENCIA'::text) AND (numerotransferencia IS NULL)))),
    CONSTRAINT ventapagos_metodopago_check CHECK (((metodopago)::text = ANY ((ARRAY['EFECTIVO'::character varying, 'TARJETA'::character varying, 'TRANSFERENCIA'::character varying])::text[]))),
    CONSTRAINT ventapagos_monto_check CHECK ((monto > (0)::numeric))
);


--
-- Name: ventapagos_ventapagoid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ventapagos ALTER COLUMN ventapagoid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ventapagos_ventapagoid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ventaproductos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ventaproductos (
    ventaid integer NOT NULL,
    productoid integer NOT NULL,
    cantidad numeric(12,4) NOT NULL,
    preciounitario numeric(12,4) NOT NULL,
    descuento numeric(12,4) DEFAULT 0,
    totalproducto numeric(12,4) GENERATED ALWAYS AS (((preciounitario * cantidad) - descuento)) STORED,
    CONSTRAINT ventaproductos_cantidad_check CHECK ((cantidad > (0)::numeric)),
    CONSTRAINT ventaproductos_descuento_check CHECK ((descuento >= (0)::numeric))
);


--
-- Name: ventas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ventas (
    ventaid integer NOT NULL,
    clienteid integer,
    sesionid integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total numeric(12,4) NOT NULL,
    descuentofactura numeric(12,4) DEFAULT 0 NOT NULL,
    tipoventa character varying(50) NOT NULL,
    lugarventa character varying(50) NOT NULL,
    tipofactura character varying(20),
    consecutivofiscal character varying(20),
    consecutivonofiscal character varying(20),
    estado boolean DEFAULT true NOT NULL,
    CONSTRAINT chk_consecutivo_exclusivo CHECK ((NOT ((consecutivofiscal IS NOT NULL) AND (consecutivonofiscal IS NOT NULL)))),
    CONSTRAINT ventas_descuentofactura_check CHECK ((descuentofactura >= (0)::numeric)),
    CONSTRAINT ventas_lugarventa_check CHECK (((lugarventa)::text = ANY ((ARRAY['NORMAL'::character varying, 'DELIVERY'::character varying])::text[]))),
    CONSTRAINT ventas_tipofactura_check CHECK (((tipofactura)::text = ANY ((ARRAY['FISCAL'::character varying, 'NO_FISCAL'::character varying])::text[]))),
    CONSTRAINT ventas_tipoventa_check CHECK (((tipoventa)::text = ANY ((ARRAY['CREDITO'::character varying, 'CONTADO'::character varying])::text[])))
);


--
-- Name: ventas_ventaid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ventas ALTER COLUMN ventaid ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ventas_ventaid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: abonos abonos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abonos
    ADD CONSTRAINT abonos_pkey PRIMARY KEY (abonoid);


--
-- Name: acumuladodecimoprimermes acumuladodecimoprimermes_empleadoid_periodoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladodecimoprimermes
    ADD CONSTRAINT acumuladodecimoprimermes_empleadoid_periodoid_key UNIQUE (empleadoid, periodoid);


--
-- Name: acumuladodecimoprimermes acumuladodecimoprimermes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladodecimoprimermes
    ADD CONSTRAINT acumuladodecimoprimermes_pkey PRIMARY KEY (acumuladodecimoid);


--
-- Name: acumuladoindemnizacion acumuladoindemnizacion_empleadoid_periodoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladoindemnizacion
    ADD CONSTRAINT acumuladoindemnizacion_empleadoid_periodoid_key UNIQUE (empleadoid, periodoid);


--
-- Name: acumuladoindemnizacion acumuladoindemnizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladoindemnizacion
    ADD CONSTRAINT acumuladoindemnizacion_pkey PRIMARY KEY (acumuladoindemnid);


--
-- Name: acumuladovacaciones acumuladovacaciones_empleadoid_periodoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladovacaciones
    ADD CONSTRAINT acumuladovacaciones_empleadoid_periodoid_key UNIQUE (empleadoid, periodoid);


--
-- Name: acumuladovacaciones acumuladovacaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladovacaciones
    ADD CONSTRAINT acumuladovacaciones_pkey PRIMARY KEY (acumuladovacid);


--
-- Name: anticipossalario anticipossalario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anticipossalario
    ADD CONSTRAINT anticipossalario_pkey PRIMARY KEY (anticipoid);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (auditoriaid);


--
-- Name: cargosempleados cargosempleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargosempleados
    ADD CONSTRAINT cargosempleados_pkey PRIMARY KEY (cargoid);


--
-- Name: categoriasclientes categoriasclientes_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoriasclientes
    ADD CONSTRAINT categoriasclientes_nombre_key UNIQUE (nombre);


--
-- Name: categoriasclientes categoriasclientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoriasclientes
    ADD CONSTRAINT categoriasclientes_pkey PRIMARY KEY (categoriaclienteid);


--
-- Name: categoriasproductos categoriasproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoriasproductos
    ADD CONSTRAINT categoriasproductos_pkey PRIMARY KEY (categoriaid);


--
-- Name: clientes clientes_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_cedula_key UNIQUE (cedula);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (clienteid);


--
-- Name: clientes clientes_ruc_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_ruc_key UNIQUE (ruc);


--
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (compraid);


--
-- Name: comprasproductos comprasproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprasproductos
    ADD CONSTRAINT comprasproductos_pkey PRIMARY KEY (compraid, productoid);


--
-- Name: configuracioninss configuracioninss_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracioninss
    ADD CONSTRAINT configuracioninss_pkey PRIMARY KEY (configinssid);


--
-- Name: costosadicionalescompras costosadicionalescompras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.costosadicionalescompras
    ADD CONSTRAINT costosadicionalescompras_pkey PRIMARY KEY (costoadicionalid);


--
-- Name: cuentasporcobrar cuentasporcobrar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentasporcobrar
    ADD CONSTRAINT cuentasporcobrar_pkey PRIMARY KEY (cuentaid);


--
-- Name: cuentasporpagar cuentasporpagar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentasporpagar
    ADD CONSTRAINT cuentasporpagar_pkey PRIMARY KEY (cuentapagarid);


--
-- Name: cuotasprestamos cuotasprestamos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuotasprestamos
    ADD CONSTRAINT cuotasprestamos_pkey PRIMARY KEY (cuotaid);


--
-- Name: cuotasprestamos cuotasprestamos_prestamoid_numerocuota_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuotasprestamos
    ADD CONSTRAINT cuotasprestamos_prestamoid_numerocuota_key UNIQUE (prestamoid, numerocuota);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (deliveryid);


--
-- Name: departamentosempleados departamentosempleados_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departamentosempleados
    ADD CONSTRAINT departamentosempleados_nombre_key UNIQUE (nombre);


--
-- Name: departamentosempleados departamentosempleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departamentosempleados
    ADD CONSTRAINT departamentosempleados_pkey PRIMARY KEY (departamentoid);


--
-- Name: devoluciones devoluciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_pkey PRIMARY KEY (devolucionid);


--
-- Name: empleados empleados_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cedula_key UNIQUE (cedula);


--
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (empleadoid);


--
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (empresaid);


--
-- Name: feriadosnacionales feriadosnacionales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feriadosnacionales
    ADD CONSTRAINT feriadosnacionales_pkey PRIMARY KEY (feriadoid);


--
-- Name: gastos gastos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gastos
    ADD CONSTRAINT gastos_pkey PRIMARY KEY (gastoid);


--
-- Name: historialsalarios historialsalarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historialsalarios
    ADD CONSTRAINT historialsalarios_pkey PRIMARY KEY (historialid);


--
-- Name: imagenesproductos imagenesproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imagenesproductos
    ADD CONSTRAINT imagenesproductos_pkey PRIMARY KEY (imagenid);


--
-- Name: liquidacionesempleados liquidacionesempleados_empleadoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.liquidacionesempleados
    ADD CONSTRAINT liquidacionesempleados_empleadoid_key UNIQUE (empleadoid);


--
-- Name: liquidacionesempleados liquidacionesempleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.liquidacionesempleados
    ADD CONSTRAINT liquidacionesempleados_pkey PRIMARY KEY (liquidacionid);


--
-- Name: mermas mermas_movimientoingresoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_movimientoingresoid_key UNIQUE (movimientoingresoid);


--
-- Name: mermas mermas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_pkey PRIMARY KEY (mermaid);


--
-- Name: movimientoscompras movimientoscompras_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoscompras
    ADD CONSTRAINT movimientoscompras_pkey PRIMARY KEY (movimientocompraid, compraid);


--
-- Name: movimientosinventario movimientosinventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientosinventario
    ADD CONSTRAINT movimientosinventario_pkey PRIMARY KEY (movimientoid);


--
-- Name: movimientoventas movimientoventas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoventas
    ADD CONSTRAINT movimientoventas_pkey PRIMARY KEY (movimeintoventaid, ventaid);


--
-- Name: ordenescompra ordenescompra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenescompra
    ADD CONSTRAINT ordenescompra_pkey PRIMARY KEY (ordencompraid);


--
-- Name: ordenescompraproductos ordenescompraproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenescompraproductos
    ADD CONSTRAINT ordenescompraproductos_pkey PRIMARY KEY (ordencompraid, productoid);


--
-- Name: pagocuentasporpagar pagocuentasporpagar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagocuentasporpagar
    ADD CONSTRAINT pagocuentasporpagar_pkey PRIMARY KEY (pagoid, cuentapagarid);


--
-- Name: pagogastos pagogastos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagogastos
    ADD CONSTRAINT pagogastos_pkey PRIMARY KEY (pagoid, gastoid);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (pagoid);


--
-- Name: pagosbeneficios pagosbeneficios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagosbeneficios
    ADD CONSTRAINT pagosbeneficios_pkey PRIMARY KEY (pagobeneficioid);


--
-- Name: periodosplanilla periodosplanilla_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodosplanilla
    ADD CONSTRAINT periodosplanilla_pkey PRIMARY KEY (periodoid);


--
-- Name: autorizaciones pk_autorizaciones; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.autorizaciones
    ADD CONSTRAINT pk_autorizaciones PRIMARY KEY (autorizacionid, usuarioid);


--
-- Name: planilladeducciones planilladeducciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladeducciones
    ADD CONSTRAINT planilladeducciones_pkey PRIMARY KEY (deduccionplanillaid);


--
-- Name: planilladetalle planilladetalle_periodoid_empleadoid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladetalle
    ADD CONSTRAINT planilladetalle_periodoid_empleadoid_key UNIQUE (periodoid, empleadoid);


--
-- Name: planilladetalle planilladetalle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladetalle
    ADD CONSTRAINT planilladetalle_pkey PRIMARY KEY (detalleid);


--
-- Name: planillahorasextra planillahorasextra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planillahorasextra
    ADD CONSTRAINT planillahorasextra_pkey PRIMARY KEY (horasextraid);


--
-- Name: prestamosempleados prestamosempleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prestamosempleados
    ADD CONSTRAINT prestamosempleados_pkey PRIMARY KEY (prestamoid);


--
-- Name: productos productos_codigobarra_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_codigobarra_key UNIQUE (codigobarra);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (productoid);


--
-- Name: proveedores proveedores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (proveedorid);


--
-- Name: registroasistencia registroasistencia_empleadoid_fecha_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registroasistencia
    ADD CONSTRAINT registroasistencia_empleadoid_fecha_key UNIQUE (empleadoid, fecha);


--
-- Name: registroasistencia registroasistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registroasistencia
    ADD CONSTRAINT registroasistencia_pkey PRIMARY KEY (asistenciaid);


--
-- Name: repartidores repartidores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repartidores
    ADD CONSTRAINT repartidores_pkey PRIMARY KEY (repartidorid);


--
-- Name: sesiones sesiones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sesiones
    ADD CONSTRAINT sesiones_pkey PRIMARY KEY (sesionid);


--
-- Name: solicitudesvacaciones solicitudesvacaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudesvacaciones
    ADD CONSTRAINT solicitudesvacaciones_pkey PRIMARY KEY (solicitudvacid);


--
-- Name: tablatramoir tablatramoir_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tablatramoir
    ADD CONSTRAINT tablatramoir_pkey PRIMARY KEY (tramoirid);


--
-- Name: unidadesmedida unidadesmedida_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unidadesmedida
    ADD CONSTRAINT unidadesmedida_nombre_key UNIQUE (nombre);


--
-- Name: unidadesmedida unidadesmedida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unidadesmedida
    ADD CONSTRAINT unidadesmedida_pkey PRIMARY KEY (unidadmedidaid);


--
-- Name: usuarios usuarios_nombreusuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombreusuario_key UNIQUE (nombreusuario);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuarioid);


--
-- Name: ventadelivery ventadelivery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventadelivery
    ADD CONSTRAINT ventadelivery_pkey PRIMARY KEY (ventaid, deliveryid);


--
-- Name: ventapagos ventapagos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventapagos
    ADD CONSTRAINT ventapagos_pkey PRIMARY KEY (ventapagoid);


--
-- Name: ventaproductos ventaproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventaproductos
    ADD CONSTRAINT ventaproductos_pkey PRIMARY KEY (ventaid, productoid);


--
-- Name: ventas ventas_consecutivofiscal_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_consecutivofiscal_key UNIQUE (consecutivofiscal);


--
-- Name: ventas ventas_consecutivonofiscal_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_consecutivonofiscal_key UNIQUE (consecutivonofiscal);


--
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (ventaid);


--
-- Name: idx_acum_decimo_empleado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acum_decimo_empleado ON public.acumuladodecimoprimermes USING btree (empleadoid);


--
-- Name: idx_acum_indemn_empleado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acum_indemn_empleado ON public.acumuladoindemnizacion USING btree (empleadoid);


--
-- Name: idx_acum_vacaciones_empleado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acum_vacaciones_empleado ON public.acumuladovacaciones USING btree (empleadoid);


--
-- Name: idx_anticipos_empleado_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_anticipos_empleado_estado ON public.anticipossalario USING btree (empleadoid, estado);


--
-- Name: idx_asistencia_empleado_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asistencia_empleado_fecha ON public.registroasistencia USING btree (empleadoid, fecha);


--
-- Name: idx_auditoria_tabla_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auditoria_tabla_fecha ON public.auditoria USING btree (tabla, fecha);


--
-- Name: idx_compras_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_compras_fecha ON public.compras USING btree (fecha);


--
-- Name: idx_cuotas_prestamo_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cuotas_prestamo_estado ON public.cuotasprestamos USING btree (prestamoid, estado);


--
-- Name: idx_movinventario_producto; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_movinventario_producto ON public.movimientosinventario USING btree (productoid);


--
-- Name: idx_planilla_detalle_empleado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planilla_detalle_empleado ON public.planilladetalle USING btree (empleadoid);


--
-- Name: idx_planilla_detalle_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planilla_detalle_estado ON public.planilladetalle USING btree (estado);


--
-- Name: idx_planilla_detalle_periodo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_planilla_detalle_periodo ON public.planilladetalle USING btree (periodoid);


--
-- Name: idx_prestamos_empleado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_prestamos_empleado ON public.prestamosempleados USING btree (empleadoid, estado);


--
-- Name: idx_productos_catalogo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_productos_catalogo ON public.productos USING btree (publicadoencatalogo) WHERE (publicadoencatalogo = true);


--
-- Name: idx_ventas_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ventas_fecha ON public.ventas USING btree (fecha);


--
-- Name: cuotasprestamos trg_actualizar_prestamo_cuota; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_prestamo_cuota AFTER UPDATE ON public.cuotasprestamos FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_prestamo_al_pagar_cuota();


--
-- Name: planilladetalle trg_acumular_beneficios; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_acumular_beneficios AFTER INSERT OR UPDATE ON public.planilladetalle FOR EACH ROW EXECUTE FUNCTION public.fn_acumular_beneficios();


--
-- Name: ventas trg_asignar_consecutivo_venta; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_asignar_consecutivo_venta BEFORE INSERT ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.fn_asignar_consecutivo_venta();


--
-- Name: compras trg_auditoria_compras; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_compras AFTER INSERT OR DELETE OR UPDATE ON public.compras FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: devoluciones trg_auditoria_devoluciones; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_devoluciones AFTER INSERT OR DELETE OR UPDATE ON public.devoluciones FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: empleados trg_auditoria_empleados; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_empleados AFTER INSERT OR DELETE OR UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: liquidacionesempleados trg_auditoria_liquidaciones; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_liquidaciones AFTER INSERT OR DELETE OR UPDATE ON public.liquidacionesempleados FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: planilladetalle trg_auditoria_planilla_detalle; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_planilla_detalle AFTER INSERT OR DELETE OR UPDATE ON public.planilladetalle FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: prestamosempleados trg_auditoria_prestamos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_prestamos AFTER INSERT OR DELETE OR UPDATE ON public.prestamosempleados FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: productos trg_auditoria_productos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_productos AFTER INSERT OR DELETE OR UPDATE ON public.productos FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: ventas trg_auditoria_ventas; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditoria_ventas AFTER INSERT OR DELETE OR UPDATE ON public.ventas FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria();


--
-- Name: registroasistencia trg_calcular_horas_asistencia; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_calcular_horas_asistencia BEFORE INSERT OR UPDATE ON public.registroasistencia FOR EACH ROW EXECUTE FUNCTION public.fn_calcular_horas_asistencia();


--
-- Name: liquidacionesempleados trg_desactivar_empleado_liquidacion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_desactivar_empleado_liquidacion AFTER UPDATE ON public.liquidacionesempleados FOR EACH ROW EXECUTE FUNCTION public.fn_desactivar_empleado_liquidacion();


--
-- Name: prestamosempleados trg_generar_cuotas_prestamo; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_generar_cuotas_prestamo AFTER INSERT ON public.prestamosempleados FOR EACH ROW EXECUTE FUNCTION public.fn_generar_cuotas_prestamo();


--
-- Name: empleados trg_historial_salario; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_historial_salario BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.fn_historial_salario();


--
-- Name: abonos abonos_cuentaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abonos
    ADD CONSTRAINT abonos_cuentaid_fkey FOREIGN KEY (cuentaid) REFERENCES public.cuentasporcobrar(cuentaid);


--
-- Name: acumuladodecimoprimermes acumuladodecimoprimermes_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladodecimoprimermes
    ADD CONSTRAINT acumuladodecimoprimermes_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: acumuladodecimoprimermes acumuladodecimoprimermes_periodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladodecimoprimermes
    ADD CONSTRAINT acumuladodecimoprimermes_periodoid_fkey FOREIGN KEY (periodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: acumuladoindemnizacion acumuladoindemnizacion_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladoindemnizacion
    ADD CONSTRAINT acumuladoindemnizacion_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: acumuladoindemnizacion acumuladoindemnizacion_periodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladoindemnizacion
    ADD CONSTRAINT acumuladoindemnizacion_periodoid_fkey FOREIGN KEY (periodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: acumuladovacaciones acumuladovacaciones_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladovacaciones
    ADD CONSTRAINT acumuladovacaciones_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: acumuladovacaciones acumuladovacaciones_periodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acumuladovacaciones
    ADD CONSTRAINT acumuladovacaciones_periodoid_fkey FOREIGN KEY (periodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: anticipossalario anticipossalario_descontadoenperiodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anticipossalario
    ADD CONSTRAINT anticipossalario_descontadoenperiodoid_fkey FOREIGN KEY (descontadoenperiodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: anticipossalario anticipossalario_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anticipossalario
    ADD CONSTRAINT anticipossalario_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: anticipossalario anticipossalario_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anticipossalario
    ADD CONSTRAINT anticipossalario_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: auditoria auditoria_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: autorizaciones autorizaciones_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.autorizaciones
    ADD CONSTRAINT autorizaciones_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: cargosempleados cargosempleados_departamentoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargosempleados
    ADD CONSTRAINT cargosempleados_departamentoid_fkey FOREIGN KEY (departamentoid) REFERENCES public.departamentosempleados(departamentoid);


--
-- Name: clientes clientes_categoriaclienteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_categoriaclienteid_fkey FOREIGN KEY (categoriaclienteid) REFERENCES public.categoriasclientes(categoriaclienteid);


--
-- Name: compras compras_ordencompraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_ordencompraid_fkey FOREIGN KEY (ordencompraid) REFERENCES public.ordenescompra(ordencompraid);


--
-- Name: compras compras_proveedorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_proveedorid_fkey FOREIGN KEY (proveedorid) REFERENCES public.proveedores(proveedorid);


--
-- Name: comprasproductos comprasproductos_compraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprasproductos
    ADD CONSTRAINT comprasproductos_compraid_fkey FOREIGN KEY (compraid) REFERENCES public.compras(compraid);


--
-- Name: comprasproductos comprasproductos_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprasproductos
    ADD CONSTRAINT comprasproductos_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: costosadicionalescompras costosadicionalescompras_compraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.costosadicionalescompras
    ADD CONSTRAINT costosadicionalescompras_compraid_fkey FOREIGN KEY (compraid) REFERENCES public.compras(compraid);


--
-- Name: cuentasporcobrar cuentasporcobrar_clienteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentasporcobrar
    ADD CONSTRAINT cuentasporcobrar_clienteid_fkey FOREIGN KEY (clienteid) REFERENCES public.clientes(clienteid);


--
-- Name: cuentasporcobrar cuentasporcobrar_ventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentasporcobrar
    ADD CONSTRAINT cuentasporcobrar_ventaid_fkey FOREIGN KEY (ventaid) REFERENCES public.ventas(ventaid);


--
-- Name: cuentasporpagar cuentasporpagar_compraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuentasporpagar
    ADD CONSTRAINT cuentasporpagar_compraid_fkey FOREIGN KEY (compraid) REFERENCES public.compras(compraid);


--
-- Name: cuotasprestamos cuotasprestamos_detalleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuotasprestamos
    ADD CONSTRAINT cuotasprestamos_detalleid_fkey FOREIGN KEY (detalleid) REFERENCES public.planilladetalle(detalleid);


--
-- Name: cuotasprestamos cuotasprestamos_prestamoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cuotasprestamos
    ADD CONSTRAINT cuotasprestamos_prestamoid_fkey FOREIGN KEY (prestamoid) REFERENCES public.prestamosempleados(prestamoid);


--
-- Name: deliveries deliveries_repartidorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_repartidorid_fkey FOREIGN KEY (repartidorid) REFERENCES public.repartidores(repartidorid);


--
-- Name: devoluciones devoluciones_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: devoluciones devoluciones_ventaid_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devoluciones
    ADD CONSTRAINT devoluciones_ventaid_productoid_fkey FOREIGN KEY (ventaid, productoid) REFERENCES public.ventaproductos(ventaid, productoid);


--
-- Name: empleados empleados_cargoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cargoid_fkey FOREIGN KEY (cargoid) REFERENCES public.cargosempleados(cargoid);


--
-- Name: empleados empleados_departamentoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_departamentoid_fkey FOREIGN KEY (departamentoid) REFERENCES public.departamentosempleados(departamentoid);


--
-- Name: departamentosempleados fk_jefe_empleado; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departamentosempleados
    ADD CONSTRAINT fk_jefe_empleado FOREIGN KEY (jefeempleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: gastos gastos_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gastos
    ADD CONSTRAINT gastos_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: historialsalarios historialsalarios_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historialsalarios
    ADD CONSTRAINT historialsalarios_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: historialsalarios historialsalarios_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historialsalarios
    ADD CONSTRAINT historialsalarios_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: imagenesproductos imagenesproductos_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imagenesproductos
    ADD CONSTRAINT imagenesproductos_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: liquidacionesempleados liquidacionesempleados_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.liquidacionesempleados
    ADD CONSTRAINT liquidacionesempleados_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: liquidacionesempleados liquidacionesempleados_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.liquidacionesempleados
    ADD CONSTRAINT liquidacionesempleados_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: mermas mermas_movimientoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_movimientoid_fkey FOREIGN KEY (movimientoid) REFERENCES public.movimientosinventario(movimientoid);


--
-- Name: mermas mermas_movimientoingresoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_movimientoingresoid_fkey FOREIGN KEY (movimientoingresoid) REFERENCES public.movimientosinventario(movimientoid);


--
-- Name: mermas mermas_productodestinoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_productodestinoid_fkey FOREIGN KEY (productodestinoid) REFERENCES public.productos(productoid);


--
-- Name: mermas mermas_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: mermas mermas_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mermas
    ADD CONSTRAINT mermas_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: movimientoscompras movimientoscompras_compraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoscompras
    ADD CONSTRAINT movimientoscompras_compraid_fkey FOREIGN KEY (compraid) REFERENCES public.compras(compraid);


--
-- Name: movimientoscompras movimientoscompras_movimientocompraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoscompras
    ADD CONSTRAINT movimientoscompras_movimientocompraid_fkey FOREIGN KEY (movimientocompraid) REFERENCES public.movimientosinventario(movimientoid);


--
-- Name: movimientosinventario movimientosinventario_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientosinventario
    ADD CONSTRAINT movimientosinventario_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: movimientoventas movimientoventas_movimeintoventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoventas
    ADD CONSTRAINT movimientoventas_movimeintoventaid_fkey FOREIGN KEY (movimeintoventaid) REFERENCES public.movimientosinventario(movimientoid);


--
-- Name: movimientoventas movimientoventas_ventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimientoventas
    ADD CONSTRAINT movimientoventas_ventaid_fkey FOREIGN KEY (ventaid) REFERENCES public.ventas(ventaid);


--
-- Name: ordenescompra ordenescompra_proveedorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenescompra
    ADD CONSTRAINT ordenescompra_proveedorid_fkey FOREIGN KEY (proveedorid) REFERENCES public.proveedores(proveedorid);


--
-- Name: ordenescompraproductos ordenescompraproductos_ordencompraid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenescompraproductos
    ADD CONSTRAINT ordenescompraproductos_ordencompraid_fkey FOREIGN KEY (ordencompraid) REFERENCES public.ordenescompra(ordencompraid);


--
-- Name: ordenescompraproductos ordenescompraproductos_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ordenescompraproductos
    ADD CONSTRAINT ordenescompraproductos_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: pagocuentasporpagar pagocuentasporpagar_cuentapagarid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagocuentasporpagar
    ADD CONSTRAINT pagocuentasporpagar_cuentapagarid_fkey FOREIGN KEY (cuentapagarid) REFERENCES public.cuentasporpagar(cuentapagarid);


--
-- Name: pagocuentasporpagar pagocuentasporpagar_pagoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagocuentasporpagar
    ADD CONSTRAINT pagocuentasporpagar_pagoid_fkey FOREIGN KEY (pagoid) REFERENCES public.pagos(pagoid);


--
-- Name: pagogastos pagogastos_gastoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagogastos
    ADD CONSTRAINT pagogastos_gastoid_fkey FOREIGN KEY (gastoid) REFERENCES public.gastos(gastoid);


--
-- Name: pagogastos pagogastos_pagoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagogastos
    ADD CONSTRAINT pagogastos_pagoid_fkey FOREIGN KEY (pagoid) REFERENCES public.pagos(pagoid);


--
-- Name: pagosbeneficios pagosbeneficios_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagosbeneficios
    ADD CONSTRAINT pagosbeneficios_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: pagosbeneficios pagosbeneficios_periodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagosbeneficios
    ADD CONSTRAINT pagosbeneficios_periodoid_fkey FOREIGN KEY (periodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: pagosbeneficios pagosbeneficios_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pagosbeneficios
    ADD CONSTRAINT pagosbeneficios_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: periodosplanilla periodosplanilla_usuarioaprobacionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periodosplanilla
    ADD CONSTRAINT periodosplanilla_usuarioaprobacionid_fkey FOREIGN KEY (usuarioaprobacionid) REFERENCES public.usuarios(usuarioid);


--
-- Name: planilladeducciones planilladeducciones_detalleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladeducciones
    ADD CONSTRAINT planilladeducciones_detalleid_fkey FOREIGN KEY (detalleid) REFERENCES public.planilladetalle(detalleid);


--
-- Name: planilladetalle planilladetalle_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladetalle
    ADD CONSTRAINT planilladetalle_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: planilladetalle planilladetalle_periodoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planilladetalle
    ADD CONSTRAINT planilladetalle_periodoid_fkey FOREIGN KEY (periodoid) REFERENCES public.periodosplanilla(periodoid);


--
-- Name: planillahorasextra planillahorasextra_detalleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planillahorasextra
    ADD CONSTRAINT planillahorasextra_detalleid_fkey FOREIGN KEY (detalleid) REFERENCES public.planilladetalle(detalleid);


--
-- Name: prestamosempleados prestamosempleados_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prestamosempleados
    ADD CONSTRAINT prestamosempleados_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: prestamosempleados prestamosempleados_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prestamosempleados
    ADD CONSTRAINT prestamosempleados_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: productos productos_categoriaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_categoriaid_fkey FOREIGN KEY (categoriaid) REFERENCES public.categoriasproductos(categoriaid);


--
-- Name: productos productos_unidadmedidaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_unidadmedidaid_fkey FOREIGN KEY (unidadmedidaid) REFERENCES public.unidadesmedida(unidadmedidaid);


--
-- Name: registroasistencia registroasistencia_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.registroasistencia
    ADD CONSTRAINT registroasistencia_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: sesiones sesiones_usuarioid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sesiones
    ADD CONSTRAINT sesiones_usuarioid_fkey FOREIGN KEY (usuarioid) REFERENCES public.usuarios(usuarioid);


--
-- Name: solicitudesvacaciones solicitudesvacaciones_empleadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudesvacaciones
    ADD CONSTRAINT solicitudesvacaciones_empleadoid_fkey FOREIGN KEY (empleadoid) REFERENCES public.empleados(empleadoid);


--
-- Name: solicitudesvacaciones solicitudesvacaciones_usuarioaprobacionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudesvacaciones
    ADD CONSTRAINT solicitudesvacaciones_usuarioaprobacionid_fkey FOREIGN KEY (usuarioaprobacionid) REFERENCES public.usuarios(usuarioid);


--
-- Name: ventadelivery ventadelivery_deliveryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventadelivery
    ADD CONSTRAINT ventadelivery_deliveryid_fkey FOREIGN KEY (deliveryid) REFERENCES public.deliveries(deliveryid);


--
-- Name: ventadelivery ventadelivery_ventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventadelivery
    ADD CONSTRAINT ventadelivery_ventaid_fkey FOREIGN KEY (ventaid) REFERENCES public.ventas(ventaid);


--
-- Name: ventapagos ventapagos_ventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventapagos
    ADD CONSTRAINT ventapagos_ventaid_fkey FOREIGN KEY (ventaid) REFERENCES public.ventas(ventaid);


--
-- Name: ventaproductos ventaproductos_productoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventaproductos
    ADD CONSTRAINT ventaproductos_productoid_fkey FOREIGN KEY (productoid) REFERENCES public.productos(productoid);


--
-- Name: ventaproductos ventaproductos_ventaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventaproductos
    ADD CONSTRAINT ventaproductos_ventaid_fkey FOREIGN KEY (ventaid) REFERENCES public.ventas(ventaid);


--
-- Name: ventas ventas_clienteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_clienteid_fkey FOREIGN KEY (clienteid) REFERENCES public.clientes(clienteid);


--
-- Name: ventas ventas_sesionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_sesionid_fkey FOREIGN KEY (sesionid) REFERENCES public.sesiones(sesionid);


--
-- PostgreSQL database dump complete
--

\unrestrict 9YRhyBnTZvhwsqE2aWvWWOAm9gkYQ06g5fdwyU14txuwfk5m6UG76eVPXTo40Ks

