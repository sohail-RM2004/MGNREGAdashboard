-- CreateTable
CREATE TABLE `State` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stateCode` VARCHAR(191) NOT NULL,
    `stateName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `State_stateCode_key`(`stateCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `District` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `districtCode` VARCHAR(191) NOT NULL,
    `districtName` VARCHAR(191) NOT NULL,
    `stateId` INTEGER NOT NULL,

    UNIQUE INDEX `District_districtCode_key`(`districtCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Performance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `finYear` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `approvedLabourBudget` DOUBLE NULL,
    `avgWageRatePerDayPerPerson` DOUBLE NULL,
    `avgDaysOfEmploymentPerHH` DOUBLE NULL,
    `differentlyAbledPersonsWorked` INTEGER NULL,
    `materialAndSkilledWages` DOUBLE NULL,
    `completedWorks` INTEGER NULL,
    `gpsWithNilExp` INTEGER NULL,
    `ongoingWorks` INTEGER NULL,
    `persondaysCentralLiability` DOUBLE NULL,
    `scPersondays` DOUBLE NULL,
    `scWorkersVsActiveWorkers` DOUBLE NULL,
    `stPersondays` DOUBLE NULL,
    `stWorkersVsActiveWorkers` DOUBLE NULL,
    `totalAdmExpenditure` DOUBLE NULL,
    `totalExp` DOUBLE NULL,
    `totalHHWorked` INTEGER NULL,
    `totalIndividualsWorked` INTEGER NULL,
    `totalActiveJobCards` INTEGER NULL,
    `totalActiveWorkers` INTEGER NULL,
    `totalHHsCompleted100Days` INTEGER NULL,
    `totalJobCardsIssued` INTEGER NULL,
    `totalWorkers` INTEGER NULL,
    `totalWorksTakenUp` INTEGER NULL,
    `wages` DOUBLE NULL,
    `womenPersondays` DOUBLE NULL,
    `percentCategoryBWorks` DOUBLE NULL,
    `percentExpAgricultureAlliedWorks` DOUBLE NULL,
    `percentNRMExpenditure` DOUBLE NULL,
    `percentPaymentsWithin15Days` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `districtId` INTEGER NOT NULL,

    INDEX `Performance_districtId_finYear_month_idx`(`districtId`, `finYear`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CachedData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apiEndpoint` VARCHAR(191) NOT NULL,
    `response` JSON NOT NULL,
    `cachedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validUntil` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `District` ADD CONSTRAINT `District_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Performance` ADD CONSTRAINT `Performance_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `District`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
