/**
 * vehicleOptions.js
 * Centralized commercial vehicle types and categories for GoMyTruck VAHAN portal.
 * Values correspond 1:1 with Prisma VehicleType enum and mobile customer app definitions.
 */

export const VEHICLE_CATEGORIES = [
  {
    category: "Two Wheelers (Express Courier & Parcel)",
    options: [
      {
        value: "BIKE",
        label: "Two Wheeler / Bike (up to 30 kg)",
        shortName: "Bike",
        capacity: "30 kg",
        image: "/vehicles/Standard Bike.webp",
      },
    ],
  },
  {
    category: "Three Wheelers (Local City Delivery)",
    options: [
      {
        value: "THREE_WHEELER",
        label: "3-Wheeler Auto / Ape (up to 500 kg)",
        shortName: "3-Wheeler Auto",
        capacity: "500 kg",
        image: "/vehicles/3 Wheeler.webp",
      },
    ],
  },
  {
    category: "Mini Trucks & SCVs (Small Commercial Vehicles)",
    options: [
      {
        value: "MAHINDRA_JEETO",
        label: "Mahindra Jeeto (600 kg)",
        shortName: "Mahindra Jeeto",
        capacity: "600 kg",
        image: "/vehicles/Mahindra Jeeto.webp",
      },
      {
        value: "TATA_ACE",
        label: "Tata Ace / Chota Hathi (750 kg)",
        shortName: "Tata Ace",
        capacity: "750 kg",
        image: "/vehicles/Tata Ace.webp",
      },
      {
        value: "MINI_OPEN_PICKUP",
        label: "Mini Open Pickup (750 kg)",
        shortName: "Mini Open Pickup",
        capacity: "750 kg",
        image: "/vehicles/Mini Open Pickup.webp",
      },
      {
        value: "MINI_CLOSED_VAN",
        label: "Mini Closed Van (750 kg)",
        shortName: "Mini Closed Van",
        capacity: "750 kg",
        image: "/vehicles/Mini Closed Van.webp",
      },
      {
        value: "ASHOK_LEYLAND_DOST",
        label: "Ashok Leyland Dost / Dost+ (1.0 Ton)",
        shortName: "Ashok Leyland Dost",
        capacity: "1.0 Ton",
        image: "/vehicles/Ashok Leyland Dost.webp",
      },
      {
        value: "BOLERO_PICKUP",
        label: "Mahindra Bolero Pickup (1.3 Ton)",
        shortName: "Bolero Pickup",
        capacity: "1.3 Ton",
        image: "/vehicles/Bolero Pickup.webp",
      },
      {
        value: "TATA_INTRA",
        label: "Tata Intra V10 / V30 (1.5 Ton)",
        shortName: "Tata Intra",
        capacity: "1.5 Ton",
        image: "/vehicles/Tata Intra.webp",
      },
      {
        value: "MINI_TRUCK",
        label: "Pickup 8ft / Mini Truck (1.25 Ton)",
        shortName: "Pickup 8ft",
        capacity: "1.25 Ton",
        image: "/vehicles/Bolero Pickup.webp",
      },
    ],
  },
  {
    category: "Medium & Intermediate Commercial Vehicles (LCV / ICV)",
    options: [
      {
        value: "LCV_BOX_TRUCK",
        label: "LCV Box Truck (2.5 Ton)",
        shortName: "LCV Box Truck",
        capacity: "2.5 Ton",
        image: "/vehicles/LCV Box Truck.webp",
      },
      {
        value: "TRUCK_14FT",
        label: "14ft Truck / Tata 407 (3.5 Ton)",
        shortName: "14ft Truck",
        capacity: "3.5 Ton",
        image: "/vehicles/14ft-truck.webp",
      },
      {
        value: "TRUCK_14FT_OPEN",
        label: "14ft Open Truck (3.5 Ton)",
        shortName: "14ft Open Truck",
        capacity: "3.5 Ton",
        image: "/vehicles/14 Ft Open Truck.webp",
      },
      {
        value: "TRUCK_14FT_CLOSED",
        label: "14ft Closed Container (3.5 Ton)",
        shortName: "14ft Closed Truck",
        capacity: "3.5 Ton",
        image: "/vehicles/14 Ft Closed Truck.webp",
      },
      {
        value: "TRUCK_17FT",
        label: "17ft Truck (6.5 Ton)",
        shortName: "17ft Truck",
        capacity: "6.5 Ton",
        image: "/vehicles/17ft-truck.webp",
      },
      {
        value: "TRUCK_17FT_CLOSED",
        label: "17ft Closed Container (6.5 Ton)",
        shortName: "17ft Closed Truck",
        capacity: "6.5 Ton",
        image: "/vehicles/17 Ft Closed Truck.webp",
      },
      {
        value: "TRUCK_19FT",
        label: "19ft Truck (8.0 Ton)",
        shortName: "19ft Truck",
        capacity: "8.0 Ton",
        image: "/vehicles/19 Ft Truck.webp",
      },
    ],
  },
  {
    category: "Heavy Commercial Vehicles (HCV) & Long-Haul Containers",
    options: [
      {
        value: "TRUCK_20FT",
        label: "20ft Truck / Open-Container (8–10 Ton)",
        shortName: "20ft Truck",
        capacity: "8–10 Ton",
        image: "/vehicles/20 Ft Truck.webp",
      },
      {
        value: "CONTAINER_32FT",
        label: "32ft Container Truck (16 Ton)",
        shortName: "32ft Container",
        capacity: "16 Ton",
        image: "/vehicles/32 Ft Container.webp",
      },
    ],
  },
];

export const ALL_VEHICLES = VEHICLE_CATEGORIES.flatMap((group) => group.options);

/**
 * Returns user-friendly formatted label for a given vehicleType enum value.
 * e.g., 'TATA_ACE' -> 'Tata Ace / Chota Hathi (750 kg)'
 */
export function getVehicleLabel(vehicleTypeValue) {
  if (!vehicleTypeValue) return "";
  const found = ALL_VEHICLES.find(
    (v) => v.value.toUpperCase() === String(vehicleTypeValue).toUpperCase()
  );
  return found ? found.label : vehicleTypeValue;
}

/**
 * Returns short display name for a given vehicleType enum value.
 * e.g., 'TATA_ACE' -> 'Tata Ace'
 */
export function getVehicleShortName(vehicleTypeValue) {
  if (!vehicleTypeValue) return "";
  const found = ALL_VEHICLES.find(
    (v) => v.value.toUpperCase() === String(vehicleTypeValue).toUpperCase()
  );
  return found ? found.shortName : vehicleTypeValue;
}
