CREATE TYPE "public"."engine_type" AS ENUM('petrol', 'diesel', 'electric', 'hybrid');--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"departure" text NOT NULL,
	"destination" text NOT NULL,
	"departure_timestamp" timestamp NOT NULL,
	"distance" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_plate" text NOT NULL,
	"name" text NOT NULL,
	"colour" text NOT NULL,
	"engine_type" "engine_type" NOT NULL,
	"avg_consumption" numeric(6, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;