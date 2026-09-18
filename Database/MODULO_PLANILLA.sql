-- =====================================================================
-- MODULO DE PLANILLA COMPLETO -- AmbientaBD
-- Archivo : MODULO_PLANILLA.sql
-- =====================================================================
-- PRERREQUISITO: Ejecutar BD.txt PRIMERO.
-- Este script necesita Usuarios y fn_auditoria() definidas alli.
--
-- EJECUCION:
--   psql  ->  \i MODULO_PLANILLA.sql
--   pgAdmin -> Query Tool conectado a AmbientaBD
--
-- COBERTURA LEGAL (Ley 185 -- Codigo del Trabajo de Nicaragua):
--   * INSS Laboral  (Art. 114)  tasa configurable, actualmente 7%
--   * INSS Patronal (Art. 114)  tasa configurable, actualmente 21.5%
--   * IR sobre salarios (LCT)   tramos DGI actualizables
--   * Decimo Tercer Mes (Art. 93) acumulacion 1/12 mensual del bruto
--   * Vacaciones (Art. 76)      2.5 dias/mes (15 dias por 6 meses)
--   * Indemnizacion (Art. 45)   1 mes/anio = 1/12 mensual del bruto
--   * Horas Extra diurnas (Art. 57)    recargo 100%
--   * Horas Extra nocturnas (Art. 57)  recargo 125%
--   * Feriados trabajados (Art. 66)    recargo 200%
--   * Liquidacion / Finiquito (Art. 42)
-- =====================================================================

\c "AmbientaBD"

-- =====================================================================
-- SECCION 0: ELIMINAR TABLAS BASE DE BD.TXT (seran recreadas aqui)
-- =====================================================================
DROP TABLE IF EXISTS PlanillaDetalle   CASCADE;
DROP TABLE IF EXISTS PeriodosPlanilla  CASCADE;
DROP TABLE IF EXISTS Empleados         CASCADE;

-- =====================================================================
-- SECCION 1: ESTRUCTURA ORGANIZACIONAL
-- =====================================================================

-- Departamentos de la empresa
CREATE TABLE DepartamentosEmpleados (
    DepartamentoID   INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre           VARCHAR(100) NOT NULL UNIQUE,
    Descripcion      TEXT,
    JefeEmpleadoID   INT,
    Estado           BOOLEAN NOT NULL DEFAULT TRUE
);

-- Cargos con rango salarial referencial
CREATE TABLE CargosEmpleados (
    CargoID                    INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DepartamentoID             INT,
    Nombre                     VARCHAR(100) NOT NULL,
    Descripcion                TEXT,
    SalarioMinimoReferencial   DECIMAL(10,2),
    SalarioMaximoReferencial   DECIMAL(10,2),
    Estado                     BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (DepartamentoID) REFERENCES DepartamentosEmpleados(DepartamentoID),
    CONSTRAINT chk_rango_salarial CHECK (
        SalarioMaximoReferencial IS NULL OR
        SalarioMaximoReferencial >= SalarioMinimoReferencial
    )
);

-- =====================================================================
-- SECCION 2: EMPLEADOS (version completa -- reemplaza BD.txt)
-- =====================================================================

CREATE TABLE Empleados (
    EmpleadoID           INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre               VARCHAR(100) NOT NULL,
    Apellidos            VARCHAR(100) NOT NULL,
    Cedula               VARCHAR(20)  NOT NULL UNIQUE,
    FechaNacimiento      DATE,
    Sexo                 CHAR(1)      CHECK (Sexo IN ('M','F')),
    Telefono             VARCHAR(20),
    Email                VARCHAR(100),
    DireccionDomicilio   TEXT,
    DepartamentoID       INT,
    CargoID              INT,
    Cargo                VARCHAR(100) NOT NULL,
    TipoContrato         VARCHAR(30)  NOT NULL
                           CHECK (TipoContrato IN ('PLANILLA','SERVICIOS_PROFESIONALES')),
    TipoJornada          VARCHAR(10)  NOT NULL DEFAULT 'DIURNA'
                           CHECK (TipoJornada IN ('DIURNA','NOCTURNA','MIXTA')),
    HorasDiariasJornada  DECIMAL(4,2) NOT NULL DEFAULT 8.00,
    SalarioBase          DECIMAL(10,2) NOT NULL,
    TipoPago             VARCHAR(20)  NOT NULL DEFAULT 'MENSUAL'
                           CHECK (TipoPago IN ('MENSUAL','QUINCENAL','SEMANAL')),
    NumeroINSS           VARCHAR(20),
    Banco                VARCHAR(100),
    CuentaBancaria       VARCHAR(50),
    TipoCuenta           VARCHAR(20)  CHECK (TipoCuenta IN ('CORRIENTE','AHORROS')),
    FechaIngreso         DATE NOT NULL,
    FechaSalida          DATE,
    MotivoSalida         VARCHAR(100),
    Estado               BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (DepartamentoID) REFERENCES DepartamentosEmpleados(DepartamentoID),
    FOREIGN KEY (CargoID)        REFERENCES CargosEmpleados(CargoID),
    CONSTRAINT chk_inss_planilla CHECK (
        TipoContrato = 'PLANILLA' OR
        (TipoContrato = 'SERVICIOS_PROFESIONALES' AND NumeroINSS IS NULL)
    )
);

-- FK diferida: jefe del departamento referencia a Empleados
ALTER TABLE DepartamentosEmpleados
    ADD CONSTRAINT fk_jefe_empleado
    FOREIGN KEY (JefeEmpleadoID) REFERENCES Empleados(EmpleadoID);

-- Historial de cambios salariales (se llena con trigger)
CREATE TABLE HistorialSalarios (
    HistorialID      INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID       INT  NOT NULL,
    SalarioAnterior  DECIMAL(10,2) NOT NULL,
    SalarioNuevo     DECIMAL(10,2) NOT NULL,
    FechaCambio      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Motivo           TEXT,
    UsuarioID        INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID)  REFERENCES Usuarios(UsuarioID)
);

-- =====================================================================
-- SECCION 3: CONFIGURACION FISCAL Y LABORAL
-- =====================================================================

-- Tasas INSS (insertar nueva fila al cambiar la ley)
CREATE TABLE ConfiguracionINSS (
    ConfigINSSID     INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TasaLaboral      DECIMAL(5,4) NOT NULL,
    TasaPatronal     DECIMAL(5,4) NOT NULL,
    FechaVigencia    DATE NOT NULL,
    FechaFinVigencia DATE,
    Activo           BOOLEAN NOT NULL DEFAULT TRUE,
    Observaciones    TEXT
);

INSERT INTO ConfiguracionINSS (TasaLaboral, TasaPatronal, FechaVigencia, Activo, Observaciones)
VALUES (0.0700, 0.2150, '2024-01-01', TRUE, 'Tasas INSS Nicaragua 2024');

-- Tramos IR anuales DGI Nicaragua (Ley de Concertacion Tributaria Art. 19)
CREATE TABLE TablaTramoIR (
    TramoIRID        INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SalarioDesde     DECIMAL(12,2) NOT NULL,
    SalarioHasta     DECIMAL(12,2),
    CuotaFija        DECIMAL(12,2) NOT NULL DEFAULT 0,
    TasaMarginal     DECIMAL(5,4)  NOT NULL DEFAULT 0,
    FechaVigencia    DATE NOT NULL,
    Activo           BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO TablaTramoIR (SalarioDesde, SalarioHasta, CuotaFija, TasaMarginal, FechaVigencia) VALUES
(        0.00,  100000.00,      0.00, 0.0000, '2024-01-01'),
(   100000.01,  200000.00,      0.00, 0.1500, '2024-01-01'),
(   200000.01,  350000.00,  15000.00, 0.2000, '2024-01-01'),
(   350000.01,  500000.00,  45000.00, 0.2500, '2024-01-01'),
(   500000.01,        NULL, 82500.00, 0.3000, '2024-01-01');

-- Feriados nacionales de Nicaragua
CREATE TABLE FeriadosNacionales (
    FeriadoID        INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre           VARCHAR(100) NOT NULL,
    Fecha            DATE NOT NULL,
    EsRecurrente     BOOLEAN NOT NULL DEFAULT TRUE,
    Activo           BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO FeriadosNacionales (Nombre, Fecha, EsRecurrente) VALUES
('Anio Nuevo',             '2024-01-01', TRUE),
('Jueves Santo',           '2024-03-28', FALSE),
('Viernes Santo',          '2024-03-29', FALSE),
('Dia del Trabajo',        '2024-05-01', TRUE),
('Dia de la Madre',        '2024-05-30', TRUE),
('Revolucion Sandinista',  '2024-07-19', TRUE),
('Batalla de San Jacinto', '2024-09-14', TRUE),
('Independencia',          '2024-09-15', TRUE),
('Dia de los Difuntos',    '2024-11-02', TRUE),
('La Purisima',            '2024-12-08', TRUE),
('Navidad',                '2024-12-25', TRUE);

-- =====================================================================
-- SECCION 4: PERIODOS Y DETALLE DE PLANILLA
-- =====================================================================

-- Periodo de pago: ABIERTO > EN_REVISION > APROBADO > PAGADO > CERRADO
CREATE TABLE PeriodosPlanilla (
    PeriodoID            INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TipoPeriodo          VARCHAR(20) NOT NULL DEFAULT 'MENSUAL'
                           CHECK (TipoPeriodo IN ('MENSUAL','QUINCENAL','SEMANAL')),
    FechaInicio          DATE NOT NULL,
    FechaFin             DATE NOT NULL,
    FechaPago            DATE,
    Estado               VARCHAR(20) NOT NULL DEFAULT 'ABIERTO'
                           CHECK (Estado IN ('ABIERTO','EN_REVISION','APROBADO','PAGADO','CERRADO')),
    Observaciones        TEXT,
    UsuarioAprobacionID  INT,
    FechaAprobacion      TIMESTAMP,
    FOREIGN KEY (UsuarioAprobacionID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT chk_fechas_periodo CHECK (FechaFin >= FechaInicio)
);

-- Detalle de planilla por empleado por periodo (UNIQUE: un empleado por periodo)
CREATE TABLE PlanillaDetalle (
    DetalleID         INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PeriodoID         INT  NOT NULL,
    EmpleadoID        INT  NOT NULL,
    SalarioBruto      DECIMAL(10,2) NOT NULL,
    MontoHorasExtra   DECIMAL(10,2) NOT NULL DEFAULT 0,
    Comisiones        DECIMAL(10,2) NOT NULL DEFAULT 0,
    PagoFeriados      DECIMAL(10,2) NOT NULL DEFAULT 0,
    OtrosIngresos     DECIMAL(10,2) NOT NULL DEFAULT 0,
    TotalIngresos     DECIMAL(10,2) GENERATED ALWAYS AS (
                        SalarioBruto + MontoHorasExtra + Comisiones
                        + PagoFeriados + OtrosIngresos) STORED,
    INSSLaboral       DECIMAL(10,2) NOT NULL DEFAULT 0,
    IR                DECIMAL(10,2) NOT NULL DEFAULT 0,
    OtrasDeducciones  DECIMAL(10,2) NOT NULL DEFAULT 0,
    CuotasPrestamos   DECIMAL(10,2) NOT NULL DEFAULT 0,
    Anticipos         DECIMAL(10,2) NOT NULL DEFAULT 0,
    TotalDeducciones  DECIMAL(10,2) GENERATED ALWAYS AS (
                        INSSLaboral + IR + OtrasDeducciones
                        + CuotasPrestamos + Anticipos) STORED,
    SalarioNeto       DECIMAL(10,2) GENERATED ALWAYS AS (
                        (SalarioBruto + MontoHorasExtra + Comisiones
                         + PagoFeriados + OtrosIngresos)
                        - (INSSLaboral + IR + OtrasDeducciones
                           + CuotasPrestamos + Anticipos)) STORED,
    INSSPatronal      DECIMAL(10,2) NOT NULL DEFAULT 0,
    Estado            VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
                        CHECK (Estado IN ('BORRADOR','APROBADO','PAGADO')),
    Observaciones     TEXT,
    FOREIGN KEY (PeriodoID)  REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    UNIQUE (PeriodoID, EmpleadoID)
);

-- Horas extra por dia: DIURNA 100%, NOCTURNA 125%, FERIADO 200%
CREATE TABLE PlanillaHorasExtra (
    HorasExtraID      INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DetalleID         INT  NOT NULL,
    Fecha             DATE NOT NULL,
    TipoHora          VARCHAR(20) NOT NULL CHECK (TipoHora IN ('DIURNA','NOCTURNA','FERIADO')),
    HorasTrabajadas   DECIMAL(4,2) NOT NULL CHECK (HorasTrabajadas > 0),
    TarifaHora        DECIMAL(10,2) NOT NULL,
    PorcentajeRecargo DECIMAL(5,2)  NOT NULL,
    MontoHoraExtra    DECIMAL(10,2) GENERATED ALWAYS AS (
                        HorasTrabajadas * TarifaHora * (PorcentajeRecargo / 100.0)) STORED,
    FOREIGN KEY (DetalleID) REFERENCES PlanillaDetalle(DetalleID)
);

-- Deducciones adicionales libres (uniformes, multas, etc.)
CREATE TABLE PlanillaDeducciones (
    DeduccionPlanillaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DetalleID           INT  NOT NULL,
    Concepto            VARCHAR(100) NOT NULL,
    Monto               DECIMAL(10,2) NOT NULL CHECK (Monto > 0),
    FOREIGN KEY (DetalleID) REFERENCES PlanillaDetalle(DetalleID)
);

-- =====================================================================
-- SECCION 5: ACUMULADOS DE BENEFICIOS LABORALES
-- Saldo actual = SUM(Acumulado) - SUM(Pagado) por empleado
-- =====================================================================

-- Decimo Tercer Mes (Art. 93): 1/divisor del ingreso por periodo
CREATE TABLE AcumuladoDecimoPrimerMes (
    AcumuladoDecimoID INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    PeriodoID         INT  NOT NULL,
    SalarioBruto      DECIMAL(10,2) NOT NULL,
    MontoAcumulado    DECIMAL(10,2) NOT NULL,
    MontoPagado       DECIMAL(10,2) NOT NULL DEFAULT 0,
    FechaGeneracion   DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID)  REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

-- Vacaciones (Art. 76): 2.5 dias/mes; MontoGanado GENERATED
CREATE TABLE AcumuladoVacaciones (
    AcumuladoVacID    INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    PeriodoID         INT  NOT NULL,
    DiasGanados       DECIMAL(6,2) NOT NULL DEFAULT 2.50,
    ValorDiaSalario   DECIMAL(10,2) NOT NULL,
    MontoGanado       DECIMAL(10,2) GENERATED ALWAYS AS (DiasGanados * ValorDiaSalario) STORED,
    DiasDisfrutados   DECIMAL(6,2) NOT NULL DEFAULT 0,
    MontoPagado       DECIMAL(10,2) NOT NULL DEFAULT 0,
    FechaGeneracion   DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID)  REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

-- Solicitudes de vacaciones: PENDIENTE > APROBADA > DISFRUTADA
CREATE TABLE SolicitudesVacaciones (
    SolicitudVacID       INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID           INT  NOT NULL,
    FechaInicio          DATE NOT NULL,
    FechaFin             DATE NOT NULL,
    DiasHabiles          DECIMAL(6,2) NOT NULL,
    Estado               VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                           CHECK (Estado IN ('PENDIENTE','APROBADA','RECHAZADA','DISFRUTADA','CANCELADA')),
    UsuarioAprobacionID  INT,
    FechaAprobacion      TIMESTAMP,
    Observaciones        TEXT,
    FOREIGN KEY (EmpleadoID)          REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioAprobacionID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT chk_fechas_vacacion CHECK (FechaFin >= FechaInicio)
);

-- Indemnizacion (Art. 45): 1/12 mensual del salario bruto
CREATE TABLE AcumuladoIndemnizacion (
    AcumuladoIndemnID INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    PeriodoID         INT  NOT NULL,
    SalarioBruto      DECIMAL(10,2) NOT NULL,
    MontoAcumulado    DECIMAL(10,2) NOT NULL,
    FechaGeneracion   DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID)  REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

-- Registro de cada pago de beneficio (decimo, vacaciones, indemnizacion)
CREATE TABLE PagosBeneficios (
    PagoBeneficioID   INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    TipoBeneficio     VARCHAR(30) NOT NULL
                        CHECK (TipoBeneficio IN ('DECIMO_TERCER_MES','VACACIONES','INDEMNIZACION')),
    MontoPagado       DECIMAL(10,2) NOT NULL CHECK (MontoPagado > 0),
    FechaPago         DATE NOT NULL,
    PeriodoID         INT,
    Observaciones     TEXT,
    UsuarioID         INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID)  REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (UsuarioID)  REFERENCES Usuarios(UsuarioID)
);

-- =====================================================================
-- SECCION 6: PRESTAMOS Y ANTICIPOS
-- =====================================================================

-- Prestamos: MontoRestante GENERATED; cuotas generadas por trigger
CREATE TABLE PrestamosEmpleados (
    PrestamoID        INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    Monto             DECIMAL(10,2) NOT NULL CHECK (Monto > 0),
    MontoPagado       DECIMAL(10,2) NOT NULL DEFAULT 0,
    MontoRestante     DECIMAL(10,2) GENERATED ALWAYS AS (Monto - MontoPagado) STORED,
    NumeroCuotas      INT  NOT NULL CHECK (NumeroCuotas > 0),
    MontoCuota        DECIMAL(10,2) NOT NULL CHECK (MontoCuota > 0),
    FechaDesembolso   DATE NOT NULL,
    Motivo            TEXT,
    Estado            VARCHAR(20) NOT NULL DEFAULT 'ACTIVO'
                        CHECK (Estado IN ('ACTIVO','PAGADO','CANCELADO')),
    UsuarioID         INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID)  REFERENCES Usuarios(UsuarioID)
);

-- Cuotas generadas automaticamente al insertar el prestamo
CREATE TABLE CuotasPrestamos (
    CuotaID           INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PrestamoID        INT  NOT NULL,
    NumeroCuota       INT  NOT NULL,
    MontoCuota        DECIMAL(10,2) NOT NULL CHECK (MontoCuota > 0),
    FechaVencimiento  DATE NOT NULL,
    FechaPago         DATE,
    Estado            VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                        CHECK (Estado IN ('PENDIENTE','PAGADA','VENCIDA')),
    DetalleID         INT,
    FOREIGN KEY (PrestamoID) REFERENCES PrestamosEmpleados(PrestamoID),
    FOREIGN KEY (DetalleID)  REFERENCES PlanillaDetalle(DetalleID),
    UNIQUE (PrestamoID, NumeroCuota)
);

-- Anticipos de salario: PENDIENTE > DESCONTADO
CREATE TABLE AnticiposSalario (
    AnticipoID              INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID              INT  NOT NULL,
    Monto                   DECIMAL(10,2) NOT NULL CHECK (Monto > 0),
    FechaAnticipoID         DATE NOT NULL,
    DescontadoEnPeriodoID   INT,
    Estado                  VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                              CHECK (Estado IN ('PENDIENTE','DESCONTADO')),
    UsuarioID               INT,
    FOREIGN KEY (EmpleadoID)            REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (DescontadoEnPeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (UsuarioID)             REFERENCES Usuarios(UsuarioID)
);

-- =====================================================================
-- SECCION 7: ASISTENCIA
-- =====================================================================

-- Marcaciones diarias; HorasTrabajadas y HorasExtra calculados por trigger
CREATE TABLE RegistroAsistencia (
    AsistenciaID      INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID        INT  NOT NULL,
    Fecha             DATE NOT NULL,
    HoraEntrada       TIME,
    HoraSalida        TIME,
    HorasTrabajadas   DECIMAL(5,2),
    HorasExtra        DECIMAL(5,2) NOT NULL DEFAULT 0,
    TipoAusencia      VARCHAR(20)
                        CHECK (TipoAusencia IN
                               ('PERMISO','ENFERMEDAD','INJUSTIFICADA','VACACION','FERIADO')),
    Observaciones     TEXT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    UNIQUE (EmpleadoID, Fecha)
);

-- =====================================================================
-- SECCION 8: LIQUIDACIONES / FINIQUITO
-- =====================================================================

-- Al marcar Estado = 'PAGADO', trigger desactiva al empleado
CREATE TABLE LiquidacionesEmpleados (
    LiquidacionID          INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID             INT  NOT NULL UNIQUE,
    FechaLiquidacion       DATE NOT NULL,
    TipoSalida             VARCHAR(30) NOT NULL
                             CHECK (TipoSalida IN (
                               'RENUNCIA','DESPIDO_JUSTIFICADO',
                               'DESPIDO_INJUSTIFICADO','MUTUO_ACUERDO','FALLECIMIENTO')),
    SalarioBrutoBase       DECIMAL(10,2) NOT NULL,
    DiasLaborados          INT  NOT NULL,
    VacacionesPagadas      DECIMAL(10,2) NOT NULL DEFAULT 0,
    DecimoTercerPagado     DECIMAL(10,2) NOT NULL DEFAULT 0,
    IndemnizacionPagada    DECIMAL(10,2) NOT NULL DEFAULT 0,
    SalariosAtrasados      DECIMAL(10,2) NOT NULL DEFAULT 0,
    OtrosBeneficios        DECIMAL(10,2) NOT NULL DEFAULT 0,
    PrestamosDescontados   DECIMAL(10,2) NOT NULL DEFAULT 0,
    AnticiposDescontados   DECIMAL(10,2) NOT NULL DEFAULT 0,
    OtrasDeduccionesLiq    DECIMAL(10,2) NOT NULL DEFAULT 0,
    TotalBruto             DECIMAL(10,2) GENERATED ALWAYS AS (
                             VacacionesPagadas + DecimoTercerPagado + IndemnizacionPagada
                             + SalariosAtrasados + OtrosBeneficios) STORED,
    TotalDescuentos        DECIMAL(10,2) GENERATED ALWAYS AS (
                             PrestamosDescontados + AnticiposDescontados
                             + OtrasDeduccionesLiq) STORED,
    MontoNeto              DECIMAL(10,2) GENERATED ALWAYS AS (
                             (VacacionesPagadas + DecimoTercerPagado + IndemnizacionPagada
                              + SalariosAtrasados + OtrosBeneficios)
                             - (PrestamosDescontados + AnticiposDescontados
                                + OtrasDeduccionesLiq)) STORED,
    Estado                 VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
                             CHECK (Estado IN ('BORRADOR','APROBADO','PAGADO')),
    UsuarioID              INT,
    Observaciones          TEXT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID)  REFERENCES Usuarios(UsuarioID)
);

-- =====================================================================
-- SECCION 9: FUNCIONES DE CALCULO
-- =====================================================================

CREATE OR REPLACE FUNCTION fn_calcular_inss_laboral(p_salario DECIMAL)
RETURNS DECIMAL AS $$
DECLARE v_tasa DECIMAL;
BEGIN
    SELECT TasaLaboral INTO v_tasa FROM ConfiguracionINSS
    WHERE Activo = TRUE ORDER BY FechaVigencia DESC LIMIT 1;
    RETURN ROUND(p_salario * COALESCE(v_tasa, 0.0700), 2);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_calcular_inss_patronal(p_salario DECIMAL)
RETURNS DECIMAL AS $$
DECLARE v_tasa DECIMAL;
BEGIN
    SELECT TasaPatronal INTO v_tasa FROM ConfiguracionINSS
    WHERE Activo = TRUE ORDER BY FechaVigencia DESC LIMIT 1;
    RETURN ROUND(p_salario * COALESCE(v_tasa, 0.2150), 2);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_calcular_ir_mensual(p_salario_bruto_mensual DECIMAL)
RETURNS DECIMAL AS $$
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
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION fn_salario_diario(p_salario_mensual DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN ROUND(p_salario_mensual / 30.0, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION fn_salario_hora(
    p_salario_mensual DECIMAL,
    p_horas_diarias   DECIMAL DEFAULT 8)
RETURNS DECIMAL AS $$
BEGIN
    RETURN ROUND(p_salario_mensual / (30.0 * p_horas_diarias), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION fn_generar_cuotas_prestamo()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================================
-- SECCION 10: TRIGGERS DE AUTOMATIZACION
-- =====================================================================

-- Trigger 1: Genera cuotas al crear prestamo
CREATE TRIGGER trg_generar_cuotas_prestamo
AFTER INSERT ON PrestamosEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_generar_cuotas_prestamo();

-- Trigger 2: Historial de salario al cambiar SalarioBase
CREATE OR REPLACE FUNCTION fn_historial_salario()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_historial_salario
BEFORE UPDATE ON Empleados
FOR EACH ROW EXECUTE FUNCTION fn_historial_salario();

-- Trigger 3: Acumula beneficios al aprobar detalle de planilla
CREATE OR REPLACE FUNCTION fn_acumular_beneficios()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_acumular_beneficios
AFTER INSERT OR UPDATE ON PlanillaDetalle
FOR EACH ROW EXECUTE FUNCTION fn_acumular_beneficios();

-- Trigger 4: Calcula horas trabajadas y extra en asistencia
CREATE OR REPLACE FUNCTION fn_calcular_horas_asistencia()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_calcular_horas_asistencia
BEFORE INSERT OR UPDATE ON RegistroAsistencia
FOR EACH ROW EXECUTE FUNCTION fn_calcular_horas_asistencia();

-- Trigger 5: Actualiza prestamo al pagar cuota
CREATE OR REPLACE FUNCTION fn_actualizar_prestamo_al_pagar_cuota()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Estado = 'PAGADA' AND OLD.Estado <> 'PAGADA' THEN
        UPDATE PrestamosEmpleados SET MontoPagado = MontoPagado + NEW.MontoCuota
        WHERE PrestamoID = NEW.PrestamoID;
        UPDATE PrestamosEmpleados SET Estado = 'PAGADO'
        WHERE PrestamoID = NEW.PrestamoID AND ROUND(Monto - MontoPagado, 2) <= 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_actualizar_prestamo_cuota
AFTER UPDATE ON CuotasPrestamos
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_prestamo_al_pagar_cuota();

-- Trigger 6: Desactiva empleado al pagar liquidacion
CREATE OR REPLACE FUNCTION fn_desactivar_empleado_liquidacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Estado = 'PAGADO' AND OLD.Estado <> 'PAGADO' THEN
        UPDATE Empleados
        SET Estado = FALSE, FechaSalida = COALESCE(FechaSalida, NEW.FechaLiquidacion)
        WHERE EmpleadoID = NEW.EmpleadoID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_desactivar_empleado_liquidacion
AFTER UPDATE ON LiquidacionesEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_desactivar_empleado_liquidacion();

-- =====================================================================
-- SECCION 11: VISTAS DE REPORTE
-- =====================================================================

CREATE OR REPLACE VIEW v_planilla_completa AS
SELECT
    pd.DetalleID, pp.PeriodoID, pp.TipoPeriodo, pp.FechaInicio, pp.FechaFin,
    pp.FechaPago, pp.Estado AS EstadoPeriodo,
    e.EmpleadoID, e.Nombre || ' ' || e.Apellidos AS NombreEmpleado,
    e.Cedula, e.Cargo, e.TipoContrato, e.TipoJornada,
    dep.Nombre AS Departamento,
    pd.SalarioBruto, pd.MontoHorasExtra, pd.Comisiones,
    pd.PagoFeriados, pd.OtrosIngresos, pd.TotalIngresos,
    pd.INSSLaboral, pd.IR, pd.OtrasDeducciones,
    pd.CuotasPrestamos, pd.Anticipos, pd.TotalDeducciones,
    pd.SalarioNeto, pd.INSSPatronal,
    pd.TotalIngresos + pd.INSSPatronal AS CostoTotalEmpresa,
    pd.Estado AS EstadoDetalle, pd.Observaciones
FROM      PlanillaDetalle        pd
JOIN      PeriodosPlanilla       pp  ON pd.PeriodoID  = pp.PeriodoID
JOIN      Empleados              e   ON pd.EmpleadoID = e.EmpleadoID
LEFT JOIN DepartamentosEmpleados dep ON e.DepartamentoID = dep.DepartamentoID;

CREATE OR REPLACE VIEW v_saldos_beneficios_empleados AS
SELECT
    e.EmpleadoID, e.Nombre || ' ' || e.Apellidos AS NombreEmpleado,
    e.Cargo, e.FechaIngreso,
    COALESCE(SUM(adm.MontoAcumulado), 0)     AS Decimo_Acumulado,
    COALESCE(SUM(adm.MontoPagado), 0)        AS Decimo_Pagado,
    COALESCE(SUM(adm.MontoAcumulado) - SUM(adm.MontoPagado), 0) AS Decimo_Saldo,
    COALESCE(SUM(av.DiasGanados), 0)         AS Vacaciones_DiasGanados,
    COALESCE(SUM(av.DiasDisfrutados), 0)     AS Vacaciones_DiasDisfrutados,
    COALESCE(SUM(av.DiasGanados) - SUM(av.DiasDisfrutados), 0) AS Vacaciones_DiasSaldo,
    COALESCE(SUM(av.MontoGanado), 0)         AS Vacaciones_MontoGanado,
    COALESCE(SUM(av.MontoPagado), 0)         AS Vacaciones_MontoPagado,
    COALESCE(SUM(ai.MontoAcumulado), 0)      AS Indemnizacion_Acumulada
FROM             Empleados               e
LEFT JOIN        AcumuladoDecimoPrimerMes adm ON e.EmpleadoID = adm.EmpleadoID
LEFT JOIN        AcumuladoVacaciones      av  ON e.EmpleadoID = av.EmpleadoID
LEFT JOIN        AcumuladoIndemnizacion   ai  ON e.EmpleadoID = ai.EmpleadoID
WHERE e.Estado = TRUE
GROUP BY e.EmpleadoID, e.Nombre, e.Apellidos, e.Cargo, e.FechaIngreso;

CREATE OR REPLACE VIEW v_prestamos_activos AS
SELECT
    pr.PrestamoID, e.EmpleadoID,
    e.Nombre || ' ' || e.Apellidos AS NombreEmpleado,
    pr.Monto AS MontoOriginal, pr.MontoPagado, pr.MontoRestante,
    pr.NumeroCuotas, pr.MontoCuota, pr.FechaDesembolso, pr.Estado,
    COUNT(cp.CuotaID) FILTER (WHERE cp.Estado = 'PENDIENTE') AS CuotasPendientes,
    COUNT(cp.CuotaID) FILTER (WHERE cp.Estado = 'VENCIDA')   AS CuotasVencidas,
    MIN(cp.FechaVencimiento) FILTER (WHERE cp.Estado = 'PENDIENTE') AS ProximaFechaVencimiento
FROM      PrestamosEmpleados pr
JOIN      Empleados          e  ON pr.EmpleadoID = e.EmpleadoID
LEFT JOIN CuotasPrestamos    cp ON pr.PrestamoID = cp.PrestamoID
WHERE pr.Estado = 'ACTIVO'
GROUP BY pr.PrestamoID, e.EmpleadoID, e.Nombre, e.Apellidos,
         pr.Monto, pr.MontoPagado, pr.MontoRestante,
         pr.NumeroCuotas, pr.MontoCuota, pr.FechaDesembolso, pr.Estado;

CREATE OR REPLACE VIEW v_empleados_activos AS
SELECT
    e.EmpleadoID, e.Nombre, e.Apellidos,
    e.Nombre || ' ' || e.Apellidos AS NombreCompleto,
    e.Cedula, e.Cargo,
    dep.Nombre AS Departamento, car.Nombre AS NombreCargo,
    e.TipoContrato, e.TipoJornada, e.HorasDiariasJornada,
    e.TipoPago, e.SalarioBase, e.FechaIngreso,
    EXTRACT(YEAR  FROM AGE(CURRENT_DATE, e.FechaIngreso))::INT AS AnosServicio,
    EXTRACT(MONTH FROM AGE(CURRENT_DATE, e.FechaIngreso))::INT AS MesesServicioAdicionales,
    e.NumeroINSS, e.Banco, e.CuentaBancaria, e.TipoCuenta, e.Telefono, e.Email
FROM      Empleados              e
LEFT JOIN DepartamentosEmpleados dep ON e.DepartamentoID = dep.DepartamentoID
LEFT JOIN CargosEmpleados        car ON e.CargoID        = car.CargoID
WHERE e.Estado = TRUE;

CREATE OR REPLACE VIEW v_costo_patronal_periodo AS
SELECT
    pp.PeriodoID, pp.TipoPeriodo, pp.FechaInicio, pp.FechaFin, pp.Estado AS EstadoPeriodo,
    COUNT(pd.DetalleID)                     AS TotalEmpleados,
    SUM(pd.SalarioBruto)                    AS TotalSalariosBrutos,
    SUM(pd.TotalIngresos)                   AS TotalIngresos,
    SUM(pd.INSSLaboral)                     AS TotalINSSLaboral,
    SUM(pd.IR)                              AS TotalIR,
    SUM(pd.TotalDeducciones)                AS TotalDeducciones,
    SUM(pd.SalarioNeto)                     AS TotalSalariosNetos,
    SUM(pd.INSSPatronal)                    AS TotalINSSPatronal,
    SUM(pd.TotalIngresos + pd.INSSPatronal) AS CostoTotalEmpresa
FROM      PeriodosPlanilla pp
JOIN      PlanillaDetalle  pd ON pp.PeriodoID = pd.PeriodoID
GROUP BY  pp.PeriodoID, pp.TipoPeriodo, pp.FechaInicio, pp.FechaFin, pp.Estado;

CREATE OR REPLACE VIEW v_asistencia_resumen AS
SELECT
    e.EmpleadoID, e.Nombre || ' ' || e.Apellidos AS NombreEmpleado,
    dep.Nombre AS Departamento,
    ra.Fecha, ra.HoraEntrada, ra.HoraSalida,
    ra.HorasTrabajadas, ra.HorasExtra, ra.TipoAusencia, ra.Observaciones
FROM      RegistroAsistencia      ra
JOIN      Empleados               e   ON ra.EmpleadoID    = e.EmpleadoID
LEFT JOIN DepartamentosEmpleados  dep ON e.DepartamentoID = dep.DepartamentoID;

-- =====================================================================
-- SECCION 12: INDICES DE RENDIMIENTO
-- =====================================================================
CREATE INDEX idx_planilla_detalle_periodo   ON PlanillaDetalle(PeriodoID);
CREATE INDEX idx_planilla_detalle_empleado  ON PlanillaDetalle(EmpleadoID);
CREATE INDEX idx_planilla_detalle_estado    ON PlanillaDetalle(Estado);
CREATE INDEX idx_asistencia_empleado_fecha  ON RegistroAsistencia(EmpleadoID, Fecha);
CREATE INDEX idx_acum_decimo_empleado       ON AcumuladoDecimoPrimerMes(EmpleadoID);
CREATE INDEX idx_acum_vacaciones_empleado   ON AcumuladoVacaciones(EmpleadoID);
CREATE INDEX idx_acum_indemn_empleado       ON AcumuladoIndemnizacion(EmpleadoID);
CREATE INDEX idx_prestamos_empleado         ON PrestamosEmpleados(EmpleadoID, Estado);
CREATE INDEX idx_cuotas_prestamo_estado     ON CuotasPrestamos(PrestamoID, Estado);
CREATE INDEX idx_anticipos_empleado_estado  ON AnticiposSalario(EmpleadoID, Estado);

-- =====================================================================
-- SECCION 13: AUDITORIA (usa fn_auditoria() de BD.txt)
-- =====================================================================
CREATE TRIGGER trg_auditoria_empleados
AFTER INSERT OR UPDATE OR DELETE ON Empleados
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_planilla_detalle
AFTER INSERT OR UPDATE OR DELETE ON PlanillaDetalle
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_liquidaciones
AFTER INSERT OR UPDATE OR DELETE ON LiquidacionesEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_prestamos
AFTER INSERT OR UPDATE OR DELETE ON PrestamosEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

-- =====================================================================
-- FIN DEL SCRIPT MODULO_PLANILLA.sql
-- =====================================================================
-- RESUMEN DE OBJETOS CREADOS:
--   TABLAS (21): DepartamentosEmpleados, CargosEmpleados, Empleados,
--     HistorialSalarios, ConfiguracionINSS, TablaTramoIR,
--     FeriadosNacionales, PeriodosPlanilla, PlanillaDetalle,
--     PlanillaHorasExtra, PlanillaDeducciones,
--     AcumuladoDecimoPrimerMes, AcumuladoVacaciones,
--     SolicitudesVacaciones, AcumuladoIndemnizacion, PagosBeneficios,
--     PrestamosEmpleados, CuotasPrestamos, AnticiposSalario,
--     RegistroAsistencia, LiquidacionesEmpleados
--   FUNCIONES (6): fn_calcular_inss_laboral, fn_calcular_inss_patronal,
--     fn_calcular_ir_mensual, fn_salario_diario, fn_salario_hora,
--     fn_generar_cuotas_prestamo
--   TRIGGERS (10): trg_generar_cuotas_prestamo, trg_historial_salario,
--     trg_acumular_beneficios, trg_calcular_horas_asistencia,
--     trg_actualizar_prestamo_cuota, trg_desactivar_empleado_liquidacion,
--     trg_auditoria_empleados, trg_auditoria_planilla_detalle,
--     trg_auditoria_liquidaciones, trg_auditoria_prestamos
--   VISTAS (6): v_planilla_completa, v_saldos_beneficios_empleados,
--     v_prestamos_activos, v_empleados_activos,
--     v_costo_patronal_periodo, v_asistencia_resumen
--   INDICES (10)
-- =====================================================================
