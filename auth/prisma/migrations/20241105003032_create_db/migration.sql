-- CreateTable
CREATE TABLE "UserRefreshToken" (
    "id" TEXT NOT NULL,
    "jti_refresh_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecoveryToken" (
    "id" TEXT NOT NULL,
    "jti_recovery_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRecoveryToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRefreshToken_user_id_key" ON "UserRefreshToken"("user_id");

-- CreateIndex
CREATE INDEX "UserRefreshToken_user_id_idx" ON "UserRefreshToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecoveryToken_user_id_key" ON "UserRecoveryToken"("user_id");

-- CreateIndex
CREATE INDEX "UserRecoveryToken_user_id_idx" ON "UserRecoveryToken"("user_id");
