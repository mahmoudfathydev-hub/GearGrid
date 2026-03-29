import { createClient } from "@supabase/supabase-js";
import { Car } from "@/types/car";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbCar {
  id?: number;
  created_at?: string;
  name: string;
  car_type: string;
  brand: string;
  price: number;
  fuel_type: string;
  description: string;
  features_amenities: string;
  engine: string;
  horse_power: number;
  transmission: string;
  color: string;
  miles: number;
  year_of_manufacture: number;
  image_urls?: string[];
}

export async function insertCar(car: Omit<DbCar, "id" | "created_at">) {
  try {
    console.log("Inserting car into Supabase:", car);

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error(
        "Supabase is not configured. Check environment variables.",
      );
    }

    const { data, error } = await supabase.from("Cars").insert([car]).select();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from Supabase");
    }

    console.log("Car inserted successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error inserting car:", error);

    if (error instanceof Error) {
      if (error.message.includes("JWT")) {
        throw new Error(
          "Authentication error: Check your Supabase configuration",
        );
      } else if (
        error.message.includes("relation") ||
        error.message.includes("table")
      ) {
        throw new Error('Database error: Make sure the "cars" table exists');
      } else if (error.message.includes("permission")) {
        throw new Error(
          "Permission error: Check RLS policies on the cars table",
        );
      } else {
        throw error;
      }
    }

    throw error;
  }
}

export async function insertBrand(brand: string) {
  try {
    console.log("Inserting brand:", brand);

    const { data, error } = await supabase
      .from("Brand")
      .insert([{ brand }])
      .select();

    console.log("Brand insert response:", { data, error });

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      if (
        error.message.includes("relation") ||
        error.message.includes("table")
      ) {
        throw new Error(
          'Database error: Make sure the "Brand" table exists with "brand" column',
        );
      } else if (error.message.includes("permission")) {
        throw new Error(
          "Permission error: Check RLS policies on the Brand table",
        );
      } else if (error.message.includes("duplicate")) {
        throw new Error(`Brand "${brand}" already exists`);
      } else {
        throw new Error(`Failed to add brand: ${error.message}`);
      }
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from database");
    }

    console.log("Brand inserted successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error inserting brand:", error);
    throw error;
  }
}

export async function insertFuelType(fuelType: string) {
  try {
    console.log("Inserting fuel type:", fuelType);

    const { data, error } = await supabase
      .from("Fuel_Type")
      .insert([{ fuel_type: fuelType }])
      .select();

    console.log("Fuel type insert response:", { data, error });

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      if (
        error.message.includes("relation") ||
        error.message.includes("table")
      ) {
        throw new Error(
          'Database error: Make sure the "Fuel_Type" table exists with "fuel_type" column',
        );
      } else if (error.message.includes("permission")) {
        throw new Error(
          "Permission error: Check RLS policies on the Fuel_Type table",
        );
      } else if (error.message.includes("duplicate")) {
        throw new Error(`Fuel type "${fuelType}" already exists`);
      } else {
        throw new Error(`Failed to add fuel type: ${error.message}`);
      }
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from database");
    }

    console.log("Fuel type inserted successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error inserting fuel type:", error);
    throw error;
  }
}

export async function insertTransmission(transmission: string) {
  try {
    console.log("Inserting transmission:", transmission);

    const { data, error } = await supabase
      .from("Transmissions")
      .insert([{ transmissions: transmission }])
      .select();

    console.log("Transmission insert response:", { data, error });

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      if (
        error.message.includes("relation") ||
        error.message.includes("table")
      ) {
        throw new Error(
          'Database error: Make sure the "Transmissions" table exists with "transmissions" column',
        );
      } else if (error.message.includes("permission")) {
        throw new Error(
          "Permission error: Check RLS policies on the Transmissions table",
        );
      } else if (error.message.includes("duplicate")) {
        throw new Error(`Transmission "${transmission}" already exists`);
      } else {
        throw new Error(`Failed to add transmission: ${error.message}`);
      }
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from database");
    }

    console.log("Transmission inserted successfully:", data[0]);
    return data[0];
  } catch (error) {
    console.error("Error inserting transmission:", error);
    throw error;
  }
}

export async function insertCarType(carType: string) {
  try {
    console.log("Inserting car type:", carType);

    const possibleColumns = ["car_type", "car-type", "type", "name"];

    for (const column of possibleColumns) {
      try {
        const { data, error } = await supabase
          .from("Car_Type")
          .insert([{ [column]: carType }])
          .select();

        if (!error && data && data.length > 0) {
          console.log(
            `Car type inserted successfully using column '${column}':`,
            data[0],
          );
          return data[0];
        }

        if (
          error &&
          !error.message.includes("column") &&
          !error.message.includes("does not exist")
        ) {
          throw error;
        }
      } catch (err) {
        continue;
      }
    }

    throw new Error(
      "Could not insert car type. Please check table structure and column names.",
    );
  } catch (error) {
    console.error("Error inserting car type:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to add car type: ${error.message}`);
    } else {
      throw new Error("Failed to add car type. Please try again.");
    }
  }
}

export async function getCarTypes() {
  try {
    const { data, error } = await supabase
      .from("Car_Type")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (
      data
        ?.map((item) => {
          if (item.car_type) return item.car_type;
          if (item["car-type"]) return item["car-type"];
          if (item.type) return item.type;
          if (item.name) return item.name;
          return null;
        })
        .filter(Boolean) || []
    );
  } catch (error) {
    console.error("Error fetching car types:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    const { data, error } = await supabase
      .from("Brand")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data?.map((item) => item.brand).filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function getFuelTypes() {
  try {
    const { data, error } = await supabase
      .from("Fuel_Type")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data?.map((item) => item.fuel_type).filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching fuel types:", error);
    return [];
  }
}

export async function getTransmissions() {
  try {
    const { data, error } = await supabase
      .from("Transmissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data?.map((item) => item.transmissions).filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching transmissions:", error);
    return [];
  }
}

function mapSupabaseToCar(car: any): Car {
  let imageUrl = "/images/1.png";

  if (car.image_urls) {
    console.log("Processing image_urls for car", car.id, ":", car.image_urls);

    if (typeof car.image_urls === "string") {
      try {
        const parsed = JSON.parse(car.image_urls);
        console.log("Parsed image_urls:", parsed);
        imageUrl =
          Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
      } catch {
        console.log("Failed to parse image_urls as JSON, using as string");

        if (
          car.image_urls.startsWith("http") ||
          car.image_urls.startsWith("/images/")
        ) {
          imageUrl = car.image_urls;
        }
      }
    } else if (Array.isArray(car.image_urls)) {
      console.log("image_urls is array:", car.image_urls);
      imageUrl = car.image_urls.length > 0 ? car.image_urls[0] : imageUrl;
    }
  }

  console.log("Final imageUrl for car", car.id, ":", imageUrl);

  let allImages: string[] = [];
  if (car.image_urls) {
    if (typeof car.image_urls === "string") {
      try {
        const parsed = JSON.parse(car.image_urls);
        allImages = Array.isArray(parsed) ? parsed : [];
      } catch {
        allImages = car.image_urls.startsWith("http") ? [car.image_urls] : [];
      }
    } else if (Array.isArray(car.image_urls)) {
      allImages = car.image_urls;
    }
  }

  return {
    id: car.id.toString(),
    brand: car.brand,
    model: car.name,
    year: car.year_of_manufacture,
    price: car.price,
    fuelType: car.fuel_type,
    transmission: car.transmission,
    carType: car.car_type,
    mileage: car.miles,
    engine: car.engine,
    horsepower: car.horse_power,
    color: car.color,
    image: imageUrl,
    images: allImages,
    description: car.description,
    features: car.features_amenities?.split(", ").filter(Boolean) || [],
  };
}

export async function getCars() {
  try {
    const { data, error } = await supabase
      .from("Cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data?.map(mapSupabaseToCar) || [];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export async function getCarStats() {
  try {
    const { data: carsData, error: carsError } = await supabase
      .from("Cars")
      .select("*");

    if (carsError) throw carsError;

    const { data: soldCarsData, error: soldCarsError } = await supabase
      .from("Sold_Cars")
      .select("*");

    if (soldCarsError) throw soldCarsError;

    const cars = carsData || [];
    const soldCars = soldCarsData || [];

    return {
      total: cars.length,
      available: cars.filter((car) => car.availability_status === "available")
        .length,
      reserved: cars.filter((car) => car.availability_status === "reserved")
        .length,
      sold: soldCars.length,
    };
  } catch (error) {
    console.error("Error fetching car stats:", error);
    return {
      total: 0,
      available: 0,
      reserved: 0,
      sold: 0,
    };
  }
}

export async function sellCar(carId: number) {
  try {
    console.log("🚗 Starting sellCar process for car ID:", carId);

    const { data: carData, error: fetchError } = await supabase
      .from("Cars")
      .select("*")
      .eq("id", carId)
      .single();

    console.log("📋 Car data fetched:", { carData, fetchError });

    if (fetchError) throw fetchError;
    if (!carData) throw new Error("Car not found");

    // Add the car to Sold_Cars table with all information
    console.log("💾 Inserting complete car data into Sold_Cars table...");
    const { error: insertError } = await supabase.from("Sold_Cars").insert({
      id: carData.id,
      created_at: carData.created_at,
      name: carData.name,
      car_type: carData.car_type,
      brand: carData.brand,
      price: carData.price,
      fuel_type: carData.fuel_type,
      description: carData.description,
      features_amenities: carData.features_amenities,
      engine: carData.engine,
      horse_power: carData.horse_power,
      transmission: carData.transmission,
      color: carData.color,
      miles: carData.miles,
      year_of_manufacture: carData.year_of_manufacture,
      image_urls: carData.image_urls,
      sold_at: new Date().toISOString(),
    });

    console.log("📝 Insert result:", { insertError });

    if (insertError) throw insertError;

    console.log("🗑️ Deleting car from Cars table...");
    const { error: deleteError } = await supabase
      .from("Cars")
      .delete()
      .eq("id", carId);

    console.log("🗑️ Delete result:", { deleteError });

    if (deleteError) throw deleteError;

    console.log("✅ Car sold successfully!");
    return { success: true, message: "Car sold successfully" };
  } catch (error) {
    console.error("❌ Error selling car:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to sell car",
    };
  }
}

export async function checkIfCarSold(carId: number) {
  try {
    const { data, error } = await supabase
      .from("Sold_Cars")
      .select("id")
      .eq("id", carId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking if car is sold:", error);
    return false;
  }
}

export async function getCarsByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from("Cars")
      .select("*")
      .in(
        "id",
        ids.map((id) => parseInt(id)),
      );

    if (error) throw error;

    return data?.map(mapSupabaseToCar) || [];
  } catch (error) {
    console.error("Error fetching cars by IDs:", error);
    return [];
  }
}

export async function deleteAllSoldCars() {
  try {
    const { data: soldCarsData, error: soldCarsError } = await supabase
      .from("Sold_Cars")
      .select("id");

    if (soldCarsError) throw soldCarsError;

    if (!soldCarsData || soldCarsData.length === 0) {
      return {
        success: true,
        message: "No sold cars found to delete",
        deletedCount: 0,
      };
    }

    const soldCarIds = soldCarsData.map((car) => car.id);
    console.log("Found sold car IDs to delete:", soldCarIds);

    const { error: deleteError, count } = await supabase
      .from("Cars")
      .delete()
      .in("id", soldCarIds);

    if (deleteError) throw deleteError;

    return {
      success: true,
      message: `Successfully deleted ${count || soldCarIds.length} sold cars from Cars table`,
      deletedCount: count || soldCarIds.length,
    };
  } catch (error) {
    console.error("Error deleting sold cars:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete sold cars",
      deletedCount: 0,
    };
  }
}
