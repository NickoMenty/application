-- CreateTable
CREATE TABLE "ContractEvent" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "txIndex" INTEGER NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "eventSignature" TEXT NOT NULL,
    "state" INTEGER NOT NULL,
    "args" TEXT NOT NULL,

    CONSTRAINT "ContractEvent_pkey" PRIMARY KEY ("id")
);
