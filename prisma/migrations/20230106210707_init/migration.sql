-- AlterTable
ALTER TABLE "point" ADD COLUMN     "ambiguity_status" VARCHAR(255),
ADD COLUMN     "easting_x" VARCHAR(255),
ADD COLUMN     "elipse_height_z" VARCHAR(255),
ADD COLUMN     "epoch" VARCHAR(255),
ADD COLUMN     "frequency" VARCHAR(255),
ADD COLUMN     "gnss_type" VARCHAR(255),
ADD COLUMN     "height_quality" VARCHAR(255),
ADD COLUMN     "northing_y" VARCHAR(255),
ADD COLUMN     "point_id" VARCHAR(255),
ADD COLUMN     "posn_height_quality" VARCHAR(255),
ADD COLUMN     "posn_quality" VARCHAR(255),
ADD COLUMN     "solution_type" VARCHAR(255),
ADD COLUMN     "stored_status" VARCHAR(255),
ADD COLUMN     "type" VARCHAR(255);
