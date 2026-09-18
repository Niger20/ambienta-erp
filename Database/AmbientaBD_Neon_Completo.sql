
-- ---------------------------------------------------------------------
-- 1. SECUENCIAS
-- ---------------------------------------------------------------------
CREATE SEQUENCE consecutivo_fiscal_seq START 1;
CREATE SEQUENCE consecutivo_no_fiscal_seq START 1;

-- ---------------------------------------------------------------------
-- 2. TABLAS BASE DE CATÁLOGO Y USUARIOS
-- ---------------------------------------------------------------------
CREATE TABLE UnidadesMedida (
    UnidadMedidaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Abreviatura VARCHAR(10) NOT NULL,
    PermiteFraccionamiento BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE CategoriasProductos (
    CategoriaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT
);

CREATE TABLE Usuarios (
    UsuarioID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    ContrasenaHash VARCHAR(255) NOT NULL,
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Rol VARCHAR(50)
);

CREATE TABLE Empresa (
    EmpresaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreEmpresa VARCHAR(100),
    Direccion TEXT,
    Telefono VARCHAR(15),
    RUC VARCHAR(50),
    LogoURL VARCHAR(255),
    TasaCambio DECIMAL(10, 2)
);

CREATE TABLE Gastos (
    GastoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE Repartidores (
    RepartidorID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15)
);

CREATE TABLE Sesiones (
    SesionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID INT NOT NULL,
    FechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaFin TIMESTAMP,
    MontoInicial DECIMAL(10, 2) NOT NULL,
    MontoFinalSistema DECIMAL(10, 2),
    MontoFinalFisico DECIMAL(10, 2),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE CategoriasClientes (
    CategoriaClienteID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    PorcentajeDescuento DECIMAL(5, 2) DEFAULT 0
);

CREATE TABLE Clientes (
    ClienteID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CategoriaClienteID INT,
    Nombre VARCHAR(100) NOT NULL,
    TipoCliente VARCHAR(20) NOT NULL DEFAULT 'NATURAL' CHECK (TipoCliente IN ('NATURAL','JURIDICO')),
    Cedula VARCHAR(20) UNIQUE,
    RUC VARCHAR(20) UNIQUE,
    Telefono VARCHAR(15),
    Direccion TEXT,
    UbicacionGeografica VARCHAR(255),
    LimiteCredito DECIMAL(10, 2),
    FOREIGN KEY (CategoriaClienteID) REFERENCES CategoriasClientes(CategoriaClienteID)
);

CREATE TABLE Proveedores (
    ProveedorID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NombreEmpresa VARCHAR(100) NOT NULL,
    AsesorVentas VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15),
    Direccion TEXT,
    UbicacionGeografica VARCHAR(255),
    Clasificacion VARCHAR(50)
);

CREATE TABLE Productos (
    ProductoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CodigoBarra VARCHAR(50) UNIQUE,
    CategoriaID INT,
    UnidadMedidaID INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    PrecioCompra DECIMAL(10, 2) NOT NULL,
    PrecioVenta DECIMAL(10, 2) NOT NULL,
    Utilidad DECIMAL(10, 2) GENERATED ALWAYS AS (PrecioVenta - PrecioCompra) STORED,
    PrecioMayoreo DECIMAL(10, 2),
    CantidadMinimaMayoreo DECIMAL(10, 2),
    StockMinimo DECIMAL(10, 2) DEFAULT 0 CHECK (StockMinimo >= 0),
    StockActual DECIMAL(10, 2) DEFAULT 0 CHECK (StockActual >= 0),
    RequiereFechaVencimiento BOOLEAN NOT NULL DEFAULT FALSE,
    FechaVencimiento DATE,
    PublicadoEnCatalogo BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (CategoriaID) REFERENCES CategoriasProductos(CategoriaID),
    FOREIGN KEY (UnidadMedidaID) REFERENCES UnidadesMedida(UnidadMedidaID),
    CONSTRAINT chk_precio_mayoreo CHECK (
        (PrecioMayoreo IS NULL AND CantidadMinimaMayoreo IS NULL) OR
        (PrecioMayoreo IS NOT NULL AND CantidadMinimaMayoreo IS NOT NULL)
    ),
    CONSTRAINT chk_fecha_vencimiento CHECK (
        RequiereFechaVencimiento = FALSE OR FechaVencimiento IS NOT NULL
    )
);

CREATE TABLE ImagenesProductos (
    ImagenID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ProductoID INT NOT NULL,
    URLImagen VARCHAR(255) NOT NULL,
    EsPrincipal BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE Deliveries (
    DeliveryID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RepartidorID INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DireccionEntrega TEXT NOT NULL,
    Costo DECIMAL(10, 2) NOT NULL,
    Estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (RepartidorID) REFERENCES Repartidores(RepartidorID)
);

-- ---------------------------------------------------------------------
-- 3. VENTAS, PAGOS, CUENTAS POR COBRAR Y DEVOLUCIONES
-- ---------------------------------------------------------------------
CREATE TABLE Ventas (
    VentaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ClienteID INT,
    SesionID INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Total DECIMAL(10, 2) NOT NULL,
    DescuentoFactura DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (DescuentoFactura >= 0),
    TipoVenta VARCHAR(50) NOT NULL CHECK (TipoVenta IN ('CREDITO','CONTADO')),
    LugarVenta VARCHAR(50) NOT NULL CHECK (LugarVenta IN ('NORMAL','DELIVERY')),
    TipoFactura VARCHAR(20) CHECK (TipoFactura IN ('FISCAL','NO_FISCAL')),
    ConsecutivoFiscal VARCHAR(20) UNIQUE,
    ConsecutivoNoFiscal VARCHAR(20) UNIQUE,
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID),
    FOREIGN KEY (SesionID) REFERENCES Sesiones(SesionID),
    CONSTRAINT chk_consecutivo_exclusivo CHECK (
        NOT (ConsecutivoFiscal IS NOT NULL AND ConsecutivoNoFiscal IS NOT NULL)
    )
);

CREATE TABLE VentaDelivery (
    VentaID INT NOT NULL,
    DeliveryID INT NOT NULL,
    PRIMARY KEY (VentaID, DeliveryID),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (DeliveryID) REFERENCES Deliveries(DeliveryID)
);

CREATE TABLE VentaProductos (
    VentaID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad DECIMAL(10, 2) NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    Descuento DECIMAL(10, 2) DEFAULT 0 CHECK (Descuento >= 0),
    TotalProducto DECIMAL(10, 2) GENERATED ALWAYS AS ((PrecioUnitario * Cantidad) - Descuento) STORED,
    PRIMARY KEY (VentaID, ProductoID),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE VentaPagos (
    VentaPagoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    VentaID INT NOT NULL,
    MetodoPago VARCHAR(20) NOT NULL CHECK (MetodoPago IN ('EFECTIVO','TARJETA','TRANSFERENCIA')),
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto > 0),
    Banco VARCHAR(100),
    NumeroTransferencia VARCHAR(50),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    CONSTRAINT chk_banco_requerido CHECK (
        (MetodoPago = 'EFECTIVO' AND Banco IS NULL) OR
        (MetodoPago IN ('TARJETA','TRANSFERENCIA') AND Banco IS NOT NULL)
    ),
    CONSTRAINT chk_numero_transferencia CHECK (
        (MetodoPago = 'TRANSFERENCIA' AND NumeroTransferencia IS NOT NULL) OR
        (MetodoPago <> 'TRANSFERENCIA' AND NumeroTransferencia IS NULL)
    )
);

CREATE TABLE CuentasPorCobrar (
    CuentaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    VentaID INT NOT NULL,
    ClienteId INT NOT NULL,
    MontoTotal DECIMAL(10, 2) NOT NULL,
    MontoPagado DECIMAL(10, 2) DEFAULT 0,
    MontoRestante DECIMAL(10, 2) GENERATED ALWAYS AS (MontoTotal - MontoPagado) STORED,
    FechaVencimiento DATE NOT NULL,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('PENDIENTE','PAGADO','VENCIDO')),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (ClienteId) REFERENCES Clientes(ClienteID)
);

CREATE TABLE Abonos (
    AbonoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CuentaID INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (CuentaID) REFERENCES CuentasPorCobrar(CuentaID)
);

CREATE TABLE MovimientosInventario (
    MovimientoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ProductoID INT NOT NULL,
    TipoMovimiento VARCHAR(50) NOT NULL CHECK (TipoMovimiento IN ('INGRESO','EGRESO','AJUSTE','MERMA','DEVOLUCION')),
    Cantidad DECIMAL(10, 2) NOT NULL,
    NumeroLote VARCHAR(50),
    StockAnterior DECIMAL(10, 2) NOT NULL,
    StockResultante DECIMAL(10, 2) GENERATED ALWAYS AS (StockAnterior + Cantidad) STORED,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Motivo TEXT,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE Devoluciones (
    DevolucionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    VentaID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad DECIMAL(10, 2) NOT NULL CHECK (Cantidad > 0),
    Motivo TEXT NOT NULL,
    MontoDevuelto DECIMAL(10, 2) NOT NULL CHECK (MontoDevuelto >= 0),
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UsuarioID INT NOT NULL,
    FOREIGN KEY (VentaID, ProductoID) REFERENCES VentaProductos(VentaID, ProductoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE Mermas (
    MermaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ProductoID INT NOT NULL,
    Cantidad DECIMAL(10, 2) NOT NULL CHECK (Cantidad > 0),
    CostoUnitario DECIMAL(10, 2) NOT NULL,
    CostoPerdida DECIMAL(10, 2) GENERATED ALWAYS AS (Cantidad * CostoUnitario) STORED,
    Motivo TEXT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UsuarioID INT NOT NULL,
    MovimientoID INT,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (MovimientoID) REFERENCES MovimientosInventario(MovimientoID)
);

CREATE TABLE MovimientoVentas (
    MovimeintoVentaID INT NOT NULL,
    VentaID INT NOT NULL,
    PRIMARY KEY (MovimeintoVentaID, VentaID),
    FOREIGN KEY (VentaID) REFERENCES Ventas(VentaID),
    FOREIGN KEY (MovimeintoVentaID) REFERENCES MovimientosInventario(MovimientoID)
);

-- ---------------------------------------------------------------------
-- 4. COMPRAS, CUENTAS POR PAGAR Y GASTOS
-- ---------------------------------------------------------------------
CREATE TABLE OrdenesCompra (
    OrdenCompraID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ProveedorID INT NOT NULL,
    FechaOrden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaEsperada DATE,
    Estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE' CHECK (Estado IN ('PENDIENTE','RECIBIDA_PARCIAL','RECIBIDA_TOTAL','CANCELADA')),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
);

CREATE TABLE OrdenesCompraProductos (
    OrdenCompraID INT NOT NULL,
    ProductoID INT NOT NULL,
    CantidadOrdenada DECIMAL(10, 2) NOT NULL CHECK (CantidadOrdenada > 0),
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (OrdenCompraID, ProductoID),
    FOREIGN KEY (OrdenCompraID) REFERENCES OrdenesCompra(OrdenCompraID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE Compras (
    CompraID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ProveedorID INT NOT NULL,
    OrdenCompraID INT,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Total DECIMAL(10, 2) NOT NULL,
    MetodoPago VARCHAR(50) NOT NULL,
    TipoCompra VARCHAR(50) NOT NULL CHECK (TipoCompra IN ('CREDITO','CONTADO')),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FacturaProveedor VARCHAR(100),
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID),
    FOREIGN KEY (OrdenCompraID) REFERENCES OrdenesCompra(OrdenCompraID)
);

CREATE TABLE ComprasProductos (
    CompraID INT NOT NULL,
    ProductoID INT NOT NULL,
    Cantidad DECIMAL(10, 2) NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    Descuento DECIMAL(10, 2) DEFAULT 0,
    TotalProducto DECIMAL(10, 2) GENERATED ALWAYS AS ((PrecioUnitario * Cantidad) - Descuento) STORED,
    NumeroLote VARCHAR(50),
    PRIMARY KEY (CompraID, ProductoID),
    FOREIGN KEY (CompraID) REFERENCES Compras(CompraID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

CREATE TABLE CostosAdicionalesCompras (
    CostoAdicionalID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CompraID INT NOT NULL,
    Concepto VARCHAR(100) NOT NULL,
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto >= 0),
    FOREIGN KEY (CompraID) REFERENCES Compras(CompraID)
);

CREATE TABLE MovimientosCompras (
    MovimientoCompraID INT NOT NULL,
    CompraID INT NOT NULL,
    PRIMARY KEY (MovimientoCompraID, CompraID),
    FOREIGN KEY (CompraID) REFERENCES Compras(CompraID),
    FOREIGN KEY (MovimientoCompraID) REFERENCES MovimientosInventario(MovimientoID)
);

CREATE TABLE CuentasPorPagar (
    CuentaPagarID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CompraID INT NOT NULL,
    MontoTotal DECIMAL(10, 2) NOT NULL,
    MontoPagado DECIMAL(10, 2) DEFAULT 0,
    MontoRestante DECIMAL(10, 2) GENERATED ALWAYS AS (MontoTotal - MontoPagado) STORED,
    Cuotas INT,
    MontoCuota DECIMAL(10, 2),
    FechaCuota INT,
    FechaVencimiento DATE NOT NULL,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('PENDIENTE','PAGADO','VENCIDO')),
    FOREIGN KEY (CompraID) REFERENCES Compras(CompraID)
);

CREATE TABLE Pagos (
    PagoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Monto DECIMAL(10, 2) NOT NULL
);

CREATE TABLE PagoCuentasPorPagar (
    PagoID INT NOT NULL,
    CuentaPagarID INT NOT NULL,
    PRIMARY KEY (PagoID, CuentaPagarID),
    FOREIGN KEY (PagoID) REFERENCES Pagos(PagoID),
    FOREIGN KEY (CuentaPagarID) REFERENCES CuentasPorPagar(CuentaPagarID)
);

CREATE TABLE PagoGastos (
    PagoID INT NOT NULL,
    GastoID INT NOT NULL,
    PRIMARY KEY (PagoID, GastoID),
    FOREIGN KEY (PagoID) REFERENCES Pagos(PagoID),
    FOREIGN KEY (GastoID) REFERENCES Gastos(GastoID)
);

CREATE TABLE Auditoria (
    AuditoriaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UsuarioID INT,
    Tabla VARCHAR(100) NOT NULL,
    Operacion VARCHAR(10) NOT NULL CHECK (Operacion IN ('INSERT','UPDATE','DELETE')),
    DatosAnteriores JSONB,
    DatosNuevos JSONB,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE Autorizaciones (
    AutorizacionID INT GENERATED ALWAYS AS IDENTITY,
    UsuarioID INT NOT NULL,
    Accion VARCHAR(100) NOT NULL,
    Detalle VARCHAR(255),
    Codigo VARCHAR(10),
    Estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_autorizaciones PRIMARY KEY (AutorizacionID, UsuarioID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- ---------------------------------------------------------------------
-- 5. MÓDULO DE PLANILLA Y GESTIÓN DE EMPLEADOS
-- ---------------------------------------------------------------------
CREATE TABLE DepartamentosEmpleados (
    DepartamentoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT,
    JefeEmpleadoID INT,
    Estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE CargosEmpleados (
    CargoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DepartamentoID INT,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    SalarioMinimoReferencial DECIMAL(10, 2),
    SalarioMaximoReferencial DECIMAL(10, 2),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (DepartamentoID) REFERENCES DepartamentosEmpleados(DepartamentoID),
    CONSTRAINT chk_rango_salarial CHECK (
        SalarioMaximoReferencial IS NULL OR
        SalarioMaximoReferencial >= SalarioMinimoReferencial
    )
);

CREATE TABLE Empleados (
    EmpleadoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Cedula VARCHAR(20) NOT NULL UNIQUE,
    FechaNacimiento DATE,
    Sexo CHAR(1) CHECK (Sexo IN ('M','F')),
    Telefono VARCHAR(20),
    Email VARCHAR(100),
    DireccionDomicilio TEXT,
    DepartamentoID INT,
    CargoID INT,
    Cargo VARCHAR(100) NOT NULL,
    TipoContrato VARCHAR(30) NOT NULL CHECK (TipoContrato IN ('PLANILLA','SERVICIOS_PROFESIONALES')),
    TipoJornada VARCHAR(10) NOT NULL DEFAULT 'DIURNA' CHECK (TipoJornada IN ('DIURNA','NOCTURNA','MIXTA')),
    HorasDiariasJornada DECIMAL(4, 2) NOT NULL DEFAULT 8.00,
    SalarioBase DECIMAL(10, 2) NOT NULL,
    TipoPago VARCHAR(20) NOT NULL DEFAULT 'MENSUAL' CHECK (TipoPago IN ('MENSUAL','QUINCENAL','SEMANAL')),
    NumeroINSS VARCHAR(20),
    Banco VARCHAR(100),
    CuentaBancaria VARCHAR(50),
    TipoCuenta VARCHAR(20) CHECK (TipoCuenta IN ('CORRIENTE','AHORROS')),
    FechaIngreso DATE NOT NULL,
    FechaSalida DATE,
    MotivoSalida VARCHAR(100),
    Estado BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (DepartamentoID) REFERENCES DepartamentosEmpleados(DepartamentoID),
    FOREIGN KEY (CargoID) REFERENCES CargosEmpleados(CargoID),
    CONSTRAINT chk_inss_planilla CHECK (
        TipoContrato = 'PLANILLA' OR
        (TipoContrato = 'SERVICIOS_PROFESIONALES' AND NumeroINSS IS NULL)
    )
);

-- FK diferida para JefeEmpleadoID
ALTER TABLE DepartamentosEmpleados
    ADD CONSTRAINT fk_jefe_empleado
    FOREIGN KEY (JefeEmpleadoID) REFERENCES Empleados(EmpleadoID);

CREATE TABLE HistorialSalarios (
    HistorialID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    SalarioAnterior DECIMAL(10, 2) NOT NULL,
    SalarioNuevo DECIMAL(10, 2) NOT NULL,
    FechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Motivo TEXT,
    UsuarioID INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE ConfiguracionINSS (
    ConfigINSSID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TasaLaboral DECIMAL(5, 4) NOT NULL,
    TasaPatronal DECIMAL(5, 4) NOT NULL,
    FechaVigencia DATE NOT NULL,
    FechaFinVigencia DATE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE,
    Observaciones TEXT
);

CREATE TABLE TablaTramoIR (
    TramoIRID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    SalarioDesde DECIMAL(12, 2) NOT NULL,
    SalarioHasta DECIMAL(12, 2),
    CuotaFija DECIMAL(12, 2) NOT NULL DEFAULT 0,
    TasaMarginal DECIMAL(5, 4) NOT NULL DEFAULT 0,
    FechaVigencia DATE NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE FeriadosNacionales (
    FeriadoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Fecha DATE NOT NULL,
    EsRecurrente BOOLEAN NOT NULL DEFAULT TRUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE PeriodosPlanilla (
    PeriodoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TipoPeriodo VARCHAR(20) NOT NULL DEFAULT 'MENSUAL' CHECK (TipoPeriodo IN ('MENSUAL','QUINCENAL','SEMANAL')),
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    FechaPago DATE,
    Estado VARCHAR(20) NOT NULL DEFAULT 'ABIERTO' CHECK (Estado IN ('ABIERTO','EN_REVISION','APROBADO','PAGADO','CERRADO')),
    Observaciones TEXT,
    UsuarioAprobacionID INT,
    FechaAprobacion TIMESTAMP,
    FOREIGN KEY (UsuarioAprobacionID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT chk_fechas_periodo CHECK (FechaFin >= FechaInicio)
);

CREATE TABLE PlanillaDetalle (
    DetalleID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PeriodoID INT NOT NULL,
    EmpleadoID INT NOT NULL,
    SalarioBruto DECIMAL(10, 2) NOT NULL,
    MontoHorasExtra DECIMAL(10, 2) NOT NULL DEFAULT 0,
    Comisiones DECIMAL(10, 2) NOT NULL DEFAULT 0,
    PagoFeriados DECIMAL(10, 2) NOT NULL DEFAULT 0,
    OtrosIngresos DECIMAL(10, 2) NOT NULL DEFAULT 0,
    TotalIngresos DECIMAL(10, 2) GENERATED ALWAYS AS (
        SalarioBruto + MontoHorasExtra + Comisiones + PagoFeriados + OtrosIngresos
    ) STORED,
    INSSLaboral DECIMAL(10, 2) NOT NULL DEFAULT 0,
    IR DECIMAL(10, 2) NOT NULL DEFAULT 0,
    OtrasDeducciones DECIMAL(10, 2) NOT NULL DEFAULT 0,
    CuotasPrestamos DECIMAL(10, 2) NOT NULL DEFAULT 0,
    Anticipos DECIMAL(10, 2) NOT NULL DEFAULT 0,
    TotalDeducciones DECIMAL(10, 2) GENERATED ALWAYS AS (
        INSSLaboral + IR + OtrasDeducciones + CuotasPrestamos + Anticipos
    ) STORED,
    SalarioNeto DECIMAL(10, 2) GENERATED ALWAYS AS (
        (SalarioBruto + MontoHorasExtra + Comisiones + PagoFeriados + OtrosIngresos)
        - (INSSLaboral + IR + OtrasDeducciones + CuotasPrestamos + Anticipos)
    ) STORED,
    INSSPatronal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    Estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR' CHECK (Estado IN ('BORRADOR','APROBADO','PAGADO')),
    Observaciones TEXT,
    FOREIGN KEY (PeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    UNIQUE (PeriodoID, EmpleadoID)
);

CREATE TABLE PlanillaHorasExtra (
    HorasExtraID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DetalleID INT NOT NULL,
    Fecha DATE NOT NULL,
    TipoHora VARCHAR(20) NOT NULL CHECK (TipoHora IN ('DIURNA','NOCTURNA','FERIADO')),
    HorasTrabajadas DECIMAL(4, 2) NOT NULL CHECK (HorasTrabajadas > 0),
    TarifaHora DECIMAL(10, 2) NOT NULL,
    PorcentajeRecargo DECIMAL(5, 2) NOT NULL,
    MontoHoraExtra DECIMAL(10, 2) GENERATED ALWAYS AS (
        HorasTrabajadas * TarifaHora * (PorcentajeRecargo / 100.0)
    ) STORED,
    FOREIGN KEY (DetalleID) REFERENCES PlanillaDetalle(DetalleID)
);

CREATE TABLE PlanillaDeducciones (
    DeduccionPlanillaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DetalleID INT NOT NULL,
    Concepto VARCHAR(100) NOT NULL,
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto > 0),
    FOREIGN KEY (DetalleID) REFERENCES PlanillaDetalle(DetalleID)
);

CREATE TABLE AcumuladoDecimoPrimerMes (
    AcumuladoDecimoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    PeriodoID INT NOT NULL,
    SalarioBruto DECIMAL(10, 2) NOT NULL,
    MontoAcumulado DECIMAL(10, 2) NOT NULL,
    MontoPagado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FechaGeneracion DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

CREATE TABLE AcumuladoVacaciones (
    AcumuladoVacID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    PeriodoID INT NOT NULL,
    DiasGanados DECIMAL(6, 2) NOT NULL DEFAULT 2.50,
    ValorDiaSalario DECIMAL(10, 2) NOT NULL,
    MontoGanado DECIMAL(10, 2) GENERATED ALWAYS AS (DiasGanados * ValorDiaSalario) STORED,
    DiasDisfrutados DECIMAL(6, 2) NOT NULL DEFAULT 0,
    MontoPagado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FechaGeneracion DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

CREATE TABLE SolicitudesVacaciones (
    SolicitudVacID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    DiasHabiles DECIMAL(6, 2) NOT NULL,
    Estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (Estado IN ('PENDIENTE','APROBADA','RECHAZADA','DISFRUTADA','CANCELADA')),
    UsuarioAprobacionID INT,
    FechaAprobacion TIMESTAMP,
    Observaciones TEXT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioAprobacionID) REFERENCES Usuarios(UsuarioID),
    CONSTRAINT chk_fechas_vacacion CHECK (FechaFin >= FechaInicio)
);

CREATE TABLE AcumuladoIndemnizacion (
    AcumuladoIndemnID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    PeriodoID INT NOT NULL,
    SalarioBruto DECIMAL(10, 2) NOT NULL,
    MontoAcumulado DECIMAL(10, 2) NOT NULL,
    FechaGeneracion DATE NOT NULL,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    UNIQUE (EmpleadoID, PeriodoID)
);

CREATE TABLE PagosBeneficios (
    PagoBeneficioID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    TipoBeneficio VARCHAR(30) NOT NULL CHECK (TipoBeneficio IN ('DECIMO_TERCER_MES','VACACIONES','INDEMNIZACION')),
    MontoPagado DECIMAL(10, 2) NOT NULL CHECK (MontoPagado > 0),
    FechaPago DATE NOT NULL,
    PeriodoID INT,
    Observaciones TEXT,
    UsuarioID INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (PeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE PrestamosEmpleados (
    PrestamoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto > 0),
    MontoPagado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    MontoRestante DECIMAL(10, 2) GENERATED ALWAYS AS (Monto - MontoPagado) STORED,
    NumeroCuotas INT NOT NULL CHECK (NumeroCuotas > 0),
    MontoCuota DECIMAL(10, 2) NOT NULL CHECK (MontoCuota > 0),
    FechaDesembolso DATE NOT NULL,
    Motivo TEXT,
    Estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO' CHECK (Estado IN ('ACTIVO','PAGADO','CANCELADO')),
    UsuarioID INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE CuotasPrestamos (
    CuotaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PrestamoID INT NOT NULL,
    NumeroCuota INT NOT NULL,
    MontoCuota DECIMAL(10, 2) NOT NULL CHECK (MontoCuota > 0),
    FechaVencimiento DATE NOT NULL,
    FechaPago DATE,
    Estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (Estado IN ('PENDIENTE','PAGADA','VENCIDA')),
    DetalleID INT,
    FOREIGN KEY (PrestamoID) REFERENCES PrestamosEmpleados(PrestamoID),
    FOREIGN KEY (DetalleID) REFERENCES PlanillaDetalle(DetalleID),
    UNIQUE (PrestamoID, NumeroCuota)
);

CREATE TABLE AnticiposSalario (
    AnticipoID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto > 0),
    FechaAnticipoID DATE NOT NULL,
    DescontadoEnPeriodoID INT,
    Estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (Estado IN ('PENDIENTE','DESCONTADO')),
    UsuarioID INT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (DescontadoEnPeriodoID) REFERENCES PeriodosPlanilla(PeriodoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE RegistroAsistencia (
    AsistenciaID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL,
    Fecha DATE NOT NULL,
    HoraEntrada TIME,
    HoraSalida TIME,
    HorasTrabajadas DECIMAL(5, 2),
    HorasExtra DECIMAL(5, 2) NOT NULL DEFAULT 0,
    TipoAusencia VARCHAR(20) CHECK (TipoAusencia IN ('PERMISO','ENFERMEDAD','INJUSTIFICADA','VACACION','FERIADO')),
    Observaciones TEXT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    UNIQUE (EmpleadoID, Fecha)
);

CREATE TABLE LiquidacionesEmpleados (
    LiquidacionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EmpleadoID INT NOT NULL UNIQUE,
    FechaLiquidacion DATE NOT NULL,
    TipoSalida VARCHAR(30) NOT NULL CHECK (TipoSalida IN ('RENUNCIA','DESPIDO_JUSTIFICADO','DESPIDO_INJUSTIFICADO','MUTUO_ACUERDO','FALLECIMIENTO')),
    SalarioBrutoBase DECIMAL(10, 2) NOT NULL,
    DiasLaborados INT NOT NULL,
    VacacionesPagadas DECIMAL(10, 2) NOT NULL DEFAULT 0,
    DecimoTercerPagado DECIMAL(10, 2) NOT NULL DEFAULT 0,
    IndemnizacionPagada DECIMAL(10, 2) NOT NULL DEFAULT 0,
    SalariosAtrasados DECIMAL(10, 2) NOT NULL DEFAULT 0,
    OtrosBeneficios DECIMAL(10, 2) NOT NULL DEFAULT 0,
    PrestamosDescontados DECIMAL(10, 2) NOT NULL DEFAULT 0,
    AnticiposDescontados DECIMAL(10, 2) NOT NULL DEFAULT 0,
    OtrasDeduccionesLiq DECIMAL(10, 2) NOT NULL DEFAULT 0,
    TotalBruto DECIMAL(10, 2) GENERATED ALWAYS AS (
        VacacionesPagadas + DecimoTercerPagado + IndemnizacionPagada + SalariosAtrasados + OtrosBeneficios
    ) STORED,
    TotalDescuentos DECIMAL(10, 2) GENERATED ALWAYS AS (
        PrestamosDescontados + AnticiposDescontados + OtrasDeduccionesLiq
    ) STORED,
    MontoNeto DECIMAL(10, 2) GENERATED ALWAYS AS (
        (VacacionesPagadas + DecimoTercerPagado + IndemnizacionPagada + SalariosAtrasados + OtrosBeneficios)
        - (PrestamosDescontados + AnticiposDescontados + OtrasDeduccionesLiq)
    ) STORED,
    Estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR' CHECK (Estado IN ('BORRADOR','APROBADO','PAGADO')),
    UsuarioID INT,
    Observaciones TEXT,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

-- ---------------------------------------------------------------------
-- 6. FUNCIONES DE BASE DE DATOS Y LÓGICA DE NEGOCIO
-- ---------------------------------------------------------------------

-- Función: Consecutivos de Facturación
CREATE OR REPLACE FUNCTION fn_asignar_consecutivo_venta()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.TipoFactura = 'FISCAL' AND NEW.ConsecutivoFiscal IS NULL THEN
        NEW.ConsecutivoFiscal := 'F' || LPAD(nextval('consecutivo_fiscal_seq')::TEXT, 6, '0');
    ELSIF NEW.TipoFactura = 'NO_FISCAL' AND NEW.ConsecutivoNoFiscal IS NULL THEN
        NEW.ConsecutivoNoFiscal := 'S' || LPAD(nextval('consecutivo_no_fiscal_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: Movimiento de Merma e Inventario
CREATE OR REPLACE FUNCTION fn_registrar_movimiento_merma()
RETURNS TRIGGER AS $$
DECLARE
    v_stock_actual DECIMAL(10, 2);
    v_movimiento_id INT;
BEGIN
    SELECT StockActual INTO v_stock_actual FROM Productos WHERE ProductoID = NEW.ProductoID;

    INSERT INTO MovimientosInventario (ProductoID, TipoMovimiento, Cantidad, StockAnterior, Motivo)
    VALUES (NEW.ProductoID, 'MERMA', -NEW.Cantidad, v_stock_actual, 'Merma: ' || NEW.Motivo)
    RETURNING MovimientoID INTO v_movimiento_id;

    UPDATE Productos SET StockActual = StockActual - NEW.Cantidad WHERE ProductoID = NEW.ProductoID;

    UPDATE Mermas SET MovimientoID = v_movimiento_id WHERE MermaID = NEW.MermaID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: Auditoría Universal
CREATE OR REPLACE FUNCTION fn_auditoria()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Funciones de Planilla: INSS y IR Nicaragua
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

-- ---------------------------------------------------------------------
-- 7. TRIGGERS
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_asignar_consecutivo_venta
BEFORE INSERT ON Ventas
FOR EACH ROW EXECUTE FUNCTION fn_asignar_consecutivo_venta();

CREATE TRIGGER trg_merma_movimiento
AFTER INSERT ON Mermas
FOR EACH ROW EXECUTE FUNCTION fn_registrar_movimiento_merma();

CREATE TRIGGER trg_generar_cuotas_prestamo
AFTER INSERT ON PrestamosEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_generar_cuotas_prestamo();

CREATE TRIGGER trg_historial_salario
BEFORE UPDATE ON Empleados
FOR EACH ROW EXECUTE FUNCTION fn_historial_salario();

CREATE TRIGGER trg_acumular_beneficios
AFTER INSERT OR UPDATE ON PlanillaDetalle
FOR EACH ROW EXECUTE FUNCTION fn_acumular_beneficios();

CREATE TRIGGER trg_calcular_horas_asistencia
BEFORE INSERT OR UPDATE ON RegistroAsistencia
FOR EACH ROW EXECUTE FUNCTION fn_calcular_horas_asistencia();

CREATE TRIGGER trg_actualizar_prestamo_cuota
AFTER UPDATE ON CuotasPrestamos
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_prestamo_al_pagar_cuota();

CREATE TRIGGER trg_desactivar_empleado_liquidacion
AFTER UPDATE ON LiquidacionesEmpleados
FOR EACH ROW EXECUTE FUNCTION fn_desactivar_empleado_liquidacion();

-- Triggers de Auditoría
CREATE TRIGGER trg_auditoria_ventas
AFTER INSERT OR UPDATE OR DELETE ON Ventas
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_productos
AFTER INSERT OR UPDATE OR DELETE ON Productos
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_compras
AFTER INSERT OR UPDATE OR DELETE ON Compras
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

CREATE TRIGGER trg_auditoria_devoluciones
AFTER INSERT OR UPDATE OR DELETE ON Devoluciones
FOR EACH ROW EXECUTE FUNCTION fn_auditoria();

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

-- ---------------------------------------------------------------------
-- 8. VISTAS DE REPORTES
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 9. ÍNDICES DE RENDIMIENTO
-- ---------------------------------------------------------------------
CREATE INDEX idx_ventas_fecha ON Ventas(Fecha);
CREATE INDEX idx_compras_fecha ON Compras(Fecha);
CREATE INDEX idx_auditoria_tabla_fecha ON Auditoria(Tabla, Fecha);
CREATE INDEX idx_movinventario_producto ON MovimientosInventario(ProductoID);
CREATE INDEX idx_productos_catalogo ON Productos(PublicadoEnCatalogo) WHERE PublicadoEnCatalogo = TRUE;

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

-- ---------------------------------------------------------------------
-- 10. DATOS INICIALES (SEMILLAS)
-- ---------------------------------------------------------------------
INSERT INTO UnidadesMedida (Nombre, Abreviatura, PermiteFraccionamiento) VALUES
('Unidad', 'UND', FALSE),
('Caja', 'CJA', FALSE),
('Metro', 'MT', TRUE),
('Kilogramo', 'KG', TRUE),
('Libra', 'LB', TRUE)
ON CONFLICT (Nombre) DO NOTHING;

INSERT INTO CategoriasClientes (Nombre, Descripcion) VALUES
('Regular', 'Cliente estándar sin condiciones especiales'),
('Frecuente', 'Cliente con compras recurrentes'),
('Mayorista', 'Cliente que compra al por mayor'),
('VIP', 'Cliente de alto valor con beneficios especiales')
ON CONFLICT (Nombre) DO NOTHING;

INSERT INTO ConfiguracionINSS (TasaLaboral, TasaPatronal, FechaVigencia, Activo, Observaciones)
VALUES (0.0700, 0.2150, '2024-01-01', TRUE, 'Tasas INSS Nicaragua 2024');

INSERT INTO TablaTramoIR (SalarioDesde, SalarioHasta, CuotaFija, TasaMarginal, FechaVigencia) VALUES
(        0.00,  100000.00,      0.00, 0.0000, '2024-01-01'),
(   100000.01,  200000.00,      0.00, 0.1500, '2024-01-01'),
(   200000.01,  350000.00,  15000.00, 0.2000, '2024-01-01'),
(   350000.01,  500000.00,  45000.00, 0.2500, '2024-01-01'),
(   500000.01,        NULL, 82500.00, 0.3000, '2024-01-01');

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
