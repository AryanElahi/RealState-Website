-- schema.prisma declares property.floor as String, but the earlier migrations
-- created it as INTEGER, so inserts failed on databases built from migrations.
-- Safe to run when the column is already TEXT.
ALTER TABLE "property" ALTER COLUMN "floor" SET DATA TYPE TEXT USING "floor"::TEXT,
ALTER COLUMN "floor" SET DEFAULT '';
