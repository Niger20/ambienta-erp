-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "apellido" VARCHAR(100),
ADD COLUMN     "correo" VARCHAR(150),
ADD COLUMN     "correoverificado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fotoperfil" VARCHAR(255),
ADD COLUMN     "nombre" VARCHAR(100),
ADD COLUMN     "rolid" INTEGER,
ADD COLUMN     "telefono" VARCHAR(30);

-- CreateTable
CREATE TABLE "roles" (
    "rolid" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "essistema" BOOLEAN NOT NULL DEFAULT false,
    "fechacreacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("rolid")
);

-- CreateTable
CREATE TABLE "permisos" (
    "permisoid" SERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("permisoid")
);

-- CreateTable
CREATE TABLE "rolespermisos" (
    "rolid" INTEGER NOT NULL,
    "permisoid" INTEGER NOT NULL,

    CONSTRAINT "rolespermisos_pkey" PRIMARY KEY ("rolid","permisoid")
);

-- CreateTable
CREATE TABLE "verificacionestoken" (
    "tokenid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "expiracion" TIMESTAMP(6) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "fechacreacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verificacionestoken_pkey" PRIMARY KEY ("tokenid")
);

-- CreateTable
CREATE TABLE "tokensesion" (
    "tokenid" SERIAL NOT NULL,
    "usuarioid" INTEGER NOT NULL,
    "jti" VARCHAR(64) NOT NULL,
    "fechaemision" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaexpira" TIMESTAMP(6) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "fecharevocado" TIMESTAMP(3),

    CONSTRAINT "tokensesion_pkey" PRIMARY KEY ("tokenid")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "verificacionestoken_token_key" ON "verificacionestoken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tokensesion_jti_key" ON "tokensesion"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolid_fkey" FOREIGN KEY ("rolid") REFERENCES "roles"("rolid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rolespermisos" ADD CONSTRAINT "rolespermisos_rolid_fkey" FOREIGN KEY ("rolid") REFERENCES "roles"("rolid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rolespermisos" ADD CONSTRAINT "rolespermisos_permisoid_fkey" FOREIGN KEY ("permisoid") REFERENCES "permisos"("permisoid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verificacionestoken" ADD CONSTRAINT "verificacionestoken_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tokensesion" ADD CONSTRAINT "tokensesion_usuarioid_fkey" FOREIGN KEY ("usuarioid") REFERENCES "usuarios"("usuarioid") ON DELETE CASCADE ON UPDATE NO ACTION;

