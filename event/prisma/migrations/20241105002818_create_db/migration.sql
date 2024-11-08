-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAddress" (
    "id" TEXT NOT NULL,
    "cep" CHAR(8) NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventJob" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "payment_hour" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCandidate" (
    "user_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCandidate_pkey" PRIMARY KEY ("user_id","job_id")
);

-- CreateTable
CREATE TABLE "EventCollaborator" (
    "user_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCollaborator_pkey" PRIMARY KEY ("user_id","job_id")
);

-- CreateIndex
CREATE INDEX "Event_id_time_user_id_idx" ON "Event"("id", "time", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventAddress_event_id_key" ON "EventAddress"("event_id");

-- CreateIndex
CREATE INDEX "EventAddress_event_id_uf_city_district_idx" ON "EventAddress"("event_id", "uf", "city", "district");

-- CreateIndex
CREATE INDEX "EventJob_id_event_id_name_payment_hour_idx" ON "EventJob"("id", "event_id", "name", "payment_hour");

-- CreateIndex
CREATE INDEX "EventCandidate_user_id_job_id_idx" ON "EventCandidate"("user_id", "job_id");

-- CreateIndex
CREATE INDEX "EventCollaborator_user_id_job_id_idx" ON "EventCollaborator"("user_id", "job_id");

-- AddForeignKey
ALTER TABLE "EventAddress" ADD CONSTRAINT "EventAddress_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventJob" ADD CONSTRAINT "EventJob_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCandidate" ADD CONSTRAINT "EventCandidate_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "EventJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCollaborator" ADD CONSTRAINT "EventCollaborator_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "EventJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
