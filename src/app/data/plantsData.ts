// src/app/data/plantsData.ts

// Una “entrada” de cuidado diario
export interface PlantEntry {
    id: number;
    day: number;
    image: string;
    description: string;
    date: string;
    location: string[];
  }
  
  // Una categoría de planta con todas sus entradas
  export interface PlantData {
    id: number;
    name: string;
    entries: PlantEntry[];
  }
  export const plantsData: Record<string, PlantData> = {
    "1": {
      id: 1,
      name: "Cactus",
      entries: [
        {
          id: 1,
          day: 1,
          image: "/assets/placeholder.svg",
          description: `Hoy recibí mi planta "Cactus". La coloqué en un lugar con luz indirecta y buena ventilación. Revisé la tierra y estaba un poco seca, así que le di un riego ligero sin encharcarla.`,
          date: "10/03/2025",
          location: ["Sala de estar"],
        },
      ],
    },
    "2": {
      id: 2,
      name: "Mala Madre",
      entries: [
        {
          id: 1,
          day: 1,
          image: "/assets/placeholder.svg",
          description: `Hoy recibí mi planta "Mala Madre". La coloqué en un lugar con luz indirecta y buena ventilación. Revisé la tierra y estaba un poco seca, así que le di un riego ligero sin encharcarla. También revisé sus hojas y parecían saludables, sin manchas ni plagas.`,
          date: "12/03/2025",
          location: ["Sala de estar"],
        },
        {
          id: 2,
          day: 2,
          image: "/assets/placeholder.svg",
          description: `Noté que algunas puntas de las hojas estaban secas, así que rocié un poco de agua alrededor para aumentar la humedad. Evité regarla demasiado porque la tierra aún estaba húmeda del riego de ayer.`,
          date: "13/03/2025",
          location: ["Baño"],
        },
        {
          id: 3,
          day: 3,
          image: "/assets/placeholder.svg",
          description: `Hoy observé que la planta parece estar adaptándose bien. Le di un ligero riego en la mañana y limpié algunas hojas con un paño húmedo para quitar el polvo.`,
          date: "14/03/2025",
          location: ["Cocina"],
        },
      ],
    },
    "3": {
      id: 3,
      name: "Rositas",
      entries: [
        {
          id: 1,
          day: 1,
          image: "/assets/placeholder.svg",
          description: `Hoy recibí mi planta "Rositas". La coloqué en un lugar con luz indirecta y buena ventilación. Revisé la tierra y estaba un poco seca, así que le di un riego ligero sin encharcarla.`,
          date: "15/03/2025",
          location: ["Sala de estar"],
        },
        {
          id: 2,
          day: 2,
          image: "/assets/placeholder.svg",
          description: `Noté que algunas puntas de las hojas estaban secas, así que rocié un poco de agua alrededor para aumentar la humedad. Evité regarla demasiado porque la tierra aún estaba húmeda del riego de ayer.`,
          date: "16/03/2025",
          location: ["Baño"],
        },
        {
          id: 3,
          day: 3,
          image: "/assets/placeholder.svg",
          description: `Hoy observé que la planta parece estar adaptándose bien. Le di un ligero riego en la mañana y limpié algunas hojas con un paño húmedo para quitar el polvo.`,
          date: "17/03/2025",
          location: ["Cocina"],
        },
      ],
    },
    "4": {
      id: 4,
      name: "Hojas azules",
      entries: [
        {
          id: 1,
          day: 1,
          image: "/assets/placeholder.svg",
          description: `Hoy recibí mi planta "Hojas azules". La coloqué en un lugar con luz indirecta y buena ventilación. Revisé la tierra y estaba un poco seca, así que le di un riego ligero sin encharcarla.`,
          date: "18/03/2025",
          location: ["Sala de estar"],
        },
      ],
    },
  };
  