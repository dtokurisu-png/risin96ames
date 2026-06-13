const boardSvg = document.getElementById("boardSvg");
const tileInfo = document.getElementById("tileInfo");
const opacitySlider = document.getElementById("opacitySlider");
const opacityValue = document.getElementById("opacityValue");
const labelToggle = document.getElementById("labelToggle");
const pointToggle = document.getElementById("pointToggle");
const newGameBtn = document.getElementById("newGameBtn");
const resourceCountsBox = document.getElementById("resourceCounts");
const buildingCard = document.getElementById("buildingCard");
const actionCard = document.getElementById("actionCard");
const gameLog = document.getElementById("gameLog");
const debugPanel = document.getElementById("debugPanel");
const buildingCardShell = document.querySelector(".building-card-shell");
const resourceBubbleLayer = document.getElementById("resourceBubbleLayer");
const turnSweepOverlay = document.getElementById("turnSweepOverlay");

const cells = [
  {
    "id": "A1",
    "row": 1,
    "col": 1,
    "cx": 408.76,
    "cy": 145.0,
    "points": [
      [
        408.76,
        82.0
      ],
      [
        463.32,
        113.5
      ],
      [
        463.32,
        176.5
      ],
      [
        408.76,
        208.0
      ],
      [
        354.2,
        176.5
      ],
      [
        354.2,
        113.5
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "port",
      "name": "Puerto del Norte",
      "description": "Puerto neutral comercial del extremo superior izquierdo."
    }
  },
  {
    "id": "A2",
    "row": 1,
    "col": 2,
    "cx": 517.88,
    "cy": 145.0,
    "points": [
      [
        517.88,
        82.0
      ],
      [
        572.44,
        113.5
      ],
      [
        572.44,
        176.5
      ],
      [
        517.88,
        208.0
      ],
      [
        463.32,
        176.5
      ],
      [
        463.32,
        113.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "A3",
    "row": 1,
    "col": 3,
    "cx": 627.0,
    "cy": 145.0,
    "points": [
      [
        627.0,
        82.0
      ],
      [
        681.56,
        113.5
      ],
      [
        681.56,
        176.5
      ],
      [
        627.0,
        208.0
      ],
      [
        572.44,
        176.5
      ],
      [
        572.44,
        113.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "A4",
    "row": 1,
    "col": 4,
    "cx": 736.12,
    "cy": 145.0,
    "points": [
      [
        736.12,
        82.0
      ],
      [
        790.68,
        113.5
      ],
      [
        790.68,
        176.5
      ],
      [
        736.12,
        208.0
      ],
      [
        681.56,
        176.5
      ],
      [
        681.56,
        113.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "A5",
    "row": 1,
    "col": 5,
    "cx": 845.24,
    "cy": 145.0,
    "points": [
      [
        845.24,
        82.0
      ],
      [
        899.8,
        113.5
      ],
      [
        899.8,
        176.5
      ],
      [
        845.24,
        208.0
      ],
      [
        790.68,
        176.5
      ],
      [
        790.68,
        113.5
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "exploration",
      "name": "Exploración Sup. Der.",
      "description": "Puesto de exploración colocado en la esquina superior derecha."
    }
  },
  {
    "id": "B1",
    "row": 2,
    "col": 1,
    "cx": 354.2,
    "cy": 239.5,
    "points": [
      [
        354.2,
        176.5
      ],
      [
        408.76,
        208.0
      ],
      [
        408.76,
        271.0
      ],
      [
        354.2,
        302.5
      ],
      [
        299.64,
        271.0
      ],
      [
        299.64,
        208.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "B2",
    "row": 2,
    "col": 2,
    "cx": 463.32,
    "cy": 239.5,
    "points": [
      [
        463.32,
        176.5
      ],
      [
        517.88,
        208.0
      ],
      [
        517.88,
        271.0
      ],
      [
        463.32,
        302.5
      ],
      [
        408.76,
        271.0
      ],
      [
        408.76,
        208.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "B3",
    "row": 2,
    "col": 3,
    "cx": 572.44,
    "cy": 239.5,
    "points": [
      [
        572.44,
        176.5
      ],
      [
        627.0,
        208.0
      ],
      [
        627.0,
        271.0
      ],
      [
        572.44,
        302.5
      ],
      [
        517.88,
        271.0
      ],
      [
        517.88,
        208.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "B4",
    "row": 2,
    "col": 4,
    "cx": 681.56,
    "cy": 239.5,
    "points": [
      [
        681.56,
        176.5
      ],
      [
        736.12,
        208.0
      ],
      [
        736.12,
        271.0
      ],
      [
        681.56,
        302.5
      ],
      [
        627.0,
        271.0
      ],
      [
        627.0,
        208.0
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "B5",
    "row": 2,
    "col": 5,
    "cx": 790.68,
    "cy": 239.5,
    "points": [
      [
        790.68,
        176.5
      ],
      [
        845.24,
        208.0
      ],
      [
        845.24,
        271.0
      ],
      [
        790.68,
        302.5
      ],
      [
        736.12,
        271.0
      ],
      [
        736.12,
        208.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "B6",
    "row": 2,
    "col": 6,
    "cx": 899.8,
    "cy": 239.5,
    "points": [
      [
        899.8,
        176.5
      ],
      [
        954.36,
        208.0
      ],
      [
        954.36,
        271.0
      ],
      [
        899.8,
        302.5
      ],
      [
        845.24,
        271.0
      ],
      [
        845.24,
        208.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "C1",
    "row": 3,
    "col": 1,
    "cx": 299.64,
    "cy": 334.0,
    "points": [
      [
        299.64,
        271.0
      ],
      [
        354.2,
        302.5
      ],
      [
        354.2,
        365.5
      ],
      [
        299.64,
        397.0
      ],
      [
        245.08,
        365.5
      ],
      [
        245.08,
        302.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "C2",
    "row": 3,
    "col": 2,
    "cx": 408.76,
    "cy": 334.0,
    "points": [
      [
        408.76,
        271.0
      ],
      [
        463.32,
        302.5
      ],
      [
        463.32,
        365.5
      ],
      [
        408.76,
        397.0
      ],
      [
        354.2,
        365.5
      ],
      [
        354.2,
        302.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "C3",
    "row": 3,
    "col": 3,
    "cx": 517.88,
    "cy": 334.0,
    "points": [
      [
        517.88,
        271.0
      ],
      [
        572.44,
        302.5
      ],
      [
        572.44,
        365.5
      ],
      [
        517.88,
        397.0
      ],
      [
        463.32,
        365.5
      ],
      [
        463.32,
        302.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "C4",
    "row": 3,
    "col": 4,
    "cx": 627.0,
    "cy": 334.0,
    "points": [
      [
        627.0,
        271.0
      ],
      [
        681.56,
        302.5
      ],
      [
        681.56,
        365.5
      ],
      [
        627.0,
        397.0
      ],
      [
        572.44,
        365.5
      ],
      [
        572.44,
        302.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "C5",
    "row": 3,
    "col": 5,
    "cx": 736.12,
    "cy": 334.0,
    "points": [
      [
        736.12,
        271.0
      ],
      [
        790.68,
        302.5
      ],
      [
        790.68,
        365.5
      ],
      [
        736.12,
        397.0
      ],
      [
        681.56,
        365.5
      ],
      [
        681.56,
        302.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "C6",
    "row": 3,
    "col": 6,
    "cx": 845.24,
    "cy": 334.0,
    "points": [
      [
        845.24,
        271.0
      ],
      [
        899.8,
        302.5
      ],
      [
        899.8,
        365.5
      ],
      [
        845.24,
        397.0
      ],
      [
        790.68,
        365.5
      ],
      [
        790.68,
        302.5
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "C7",
    "row": 3,
    "col": 7,
    "cx": 954.36,
    "cy": 334.0,
    "points": [
      [
        954.36,
        271.0
      ],
      [
        1008.92,
        302.5
      ],
      [
        1008.92,
        365.5
      ],
      [
        954.36,
        397.0
      ],
      [
        899.8,
        365.5
      ],
      [
        899.8,
        302.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "D1",
    "row": 4,
    "col": 1,
    "cx": 245.08,
    "cy": 428.5,
    "points": [
      [
        245.08,
        365.5
      ],
      [
        299.64,
        397.0
      ],
      [
        299.64,
        460.0
      ],
      [
        245.08,
        491.5
      ],
      [
        190.52,
        460.0
      ],
      [
        190.52,
        397.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "D2",
    "row": 4,
    "col": 2,
    "cx": 354.2,
    "cy": 428.5,
    "points": [
      [
        354.2,
        365.5
      ],
      [
        408.76,
        397.0
      ],
      [
        408.76,
        460.0
      ],
      [
        354.2,
        491.5
      ],
      [
        299.64,
        460.0
      ],
      [
        299.64,
        397.0
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "D3",
    "row": 4,
    "col": 3,
    "cx": 463.32,
    "cy": 428.5,
    "points": [
      [
        463.32,
        365.5
      ],
      [
        517.88,
        397.0
      ],
      [
        517.88,
        460.0
      ],
      [
        463.32,
        491.5
      ],
      [
        408.76,
        460.0
      ],
      [
        408.76,
        397.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "church",
      "name": "Iglesia D3",
      "description": "Iglesia especial."
    }
  },
  {
    "id": "D4",
    "row": 4,
    "col": 4,
    "cx": 572.44,
    "cy": 428.5,
    "points": [
      [
        572.44,
        365.5
      ],
      [
        627.0,
        397.0
      ],
      [
        627.0,
        460.0
      ],
      [
        572.44,
        491.5
      ],
      [
        517.88,
        460.0
      ],
      [
        517.88,
        397.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "D5",
    "row": 4,
    "col": 5,
    "cx": 681.56,
    "cy": 428.5,
    "points": [
      [
        681.56,
        365.5
      ],
      [
        736.12,
        397.0
      ],
      [
        736.12,
        460.0
      ],
      [
        681.56,
        491.5
      ],
      [
        627.0,
        460.0
      ],
      [
        627.0,
        397.0
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "D6",
    "row": 4,
    "col": 6,
    "cx": 790.68,
    "cy": 428.5,
    "points": [
      [
        790.68,
        365.5
      ],
      [
        845.24,
        397.0
      ],
      [
        845.24,
        460.0
      ],
      [
        790.68,
        491.5
      ],
      [
        736.12,
        460.0
      ],
      [
        736.12,
        397.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "settlement",
      "name": "Asentamiento D6",
      "description": "Asentamiento comercial especial."
    }
  },
  {
    "id": "D7",
    "row": 4,
    "col": 7,
    "cx": 899.8,
    "cy": 428.5,
    "points": [
      [
        899.8,
        365.5
      ],
      [
        954.36,
        397.0
      ],
      [
        954.36,
        460.0
      ],
      [
        899.8,
        491.5
      ],
      [
        845.24,
        460.0
      ],
      [
        845.24,
        397.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "D8",
    "row": 4,
    "col": 8,
    "cx": 1008.92,
    "cy": 428.5,
    "points": [
      [
        1008.92,
        365.5
      ],
      [
        1063.48,
        397.0
      ],
      [
        1063.48,
        460.0
      ],
      [
        1008.92,
        491.5
      ],
      [
        954.36,
        460.0
      ],
      [
        954.36,
        397.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E1",
    "row": 5,
    "col": 1,
    "cx": 190.52,
    "cy": 523.0,
    "points": [
      [
        190.52,
        460.0
      ],
      [
        245.08,
        491.5
      ],
      [
        245.08,
        554.5
      ],
      [
        190.52,
        586.0
      ],
      [
        135.96,
        554.5
      ],
      [
        135.96,
        491.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "E2",
    "row": 5,
    "col": 2,
    "cx": 299.64,
    "cy": 523.0,
    "points": [
      [
        299.64,
        460.0
      ],
      [
        354.2,
        491.5
      ],
      [
        354.2,
        554.5
      ],
      [
        299.64,
        586.0
      ],
      [
        245.08,
        554.5
      ],
      [
        245.08,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E3",
    "row": 5,
    "col": 3,
    "cx": 408.76,
    "cy": 523.0,
    "points": [
      [
        408.76,
        460.0
      ],
      [
        463.32,
        491.5
      ],
      [
        463.32,
        554.5
      ],
      [
        408.76,
        586.0
      ],
      [
        354.2,
        554.5
      ],
      [
        354.2,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E4",
    "row": 5,
    "col": 4,
    "cx": 517.88,
    "cy": 523.0,
    "points": [
      [
        517.88,
        460.0
      ],
      [
        572.44,
        491.5
      ],
      [
        572.44,
        554.5
      ],
      [
        517.88,
        586.0
      ],
      [
        463.32,
        554.5
      ],
      [
        463.32,
        491.5
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "E5",
    "row": 5,
    "col": 5,
    "cx": 627.0,
    "cy": 523.0,
    "points": [
      [
        627.0,
        460.0
      ],
      [
        681.56,
        491.5
      ],
      [
        681.56,
        554.5
      ],
      [
        627.0,
        586.0
      ],
      [
        572.44,
        554.5
      ],
      [
        572.44,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E6",
    "row": 5,
    "col": 6,
    "cx": 736.12,
    "cy": 523.0,
    "points": [
      [
        736.12,
        460.0
      ],
      [
        790.68,
        491.5
      ],
      [
        790.68,
        554.5
      ],
      [
        736.12,
        586.0
      ],
      [
        681.56,
        554.5
      ],
      [
        681.56,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E7",
    "row": 5,
    "col": 7,
    "cx": 845.24,
    "cy": 523.0,
    "points": [
      [
        845.24,
        460.0
      ],
      [
        899.8,
        491.5
      ],
      [
        899.8,
        554.5
      ],
      [
        845.24,
        586.0
      ],
      [
        790.68,
        554.5
      ],
      [
        790.68,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E8",
    "row": 5,
    "col": 8,
    "cx": 954.36,
    "cy": 523.0,
    "points": [
      [
        954.36,
        460.0
      ],
      [
        1008.92,
        491.5
      ],
      [
        1008.92,
        554.5
      ],
      [
        954.36,
        586.0
      ],
      [
        899.8,
        554.5
      ],
      [
        899.8,
        491.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "E9",
    "row": 5,
    "col": 9,
    "cx": 1063.48,
    "cy": 523.0,
    "points": [
      [
        1063.48,
        460.0
      ],
      [
        1118.04,
        491.5
      ],
      [
        1118.04,
        554.5
      ],
      [
        1063.48,
        586.0
      ],
      [
        1008.92,
        554.5
      ],
      [
        1008.92,
        491.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "F1",
    "row": 6,
    "col": 1,
    "cx": 135.96,
    "cy": 617.5,
    "points": [
      [
        135.96,
        554.5
      ],
      [
        190.52,
        586.0
      ],
      [
        190.52,
        649.0
      ],
      [
        135.96,
        680.5
      ],
      [
        81.4,
        649.0
      ],
      [
        81.4,
        586.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "exploration",
      "name": "Exploración Central Izq.",
      "description": "Puesto de exploración colocado en la zona central izquierda."
    }
  },
  {
    "id": "F2",
    "row": 6,
    "col": 2,
    "cx": 245.08,
    "cy": 617.5,
    "points": [
      [
        245.08,
        554.5
      ],
      [
        299.64,
        586.0
      ],
      [
        299.64,
        649.0
      ],
      [
        245.08,
        680.5
      ],
      [
        190.52,
        649.0
      ],
      [
        190.52,
        586.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "F3",
    "row": 6,
    "col": 3,
    "cx": 354.2,
    "cy": 617.5,
    "points": [
      [
        354.2,
        554.5
      ],
      [
        408.76,
        586.0
      ],
      [
        408.76,
        649.0
      ],
      [
        354.2,
        680.5
      ],
      [
        299.64,
        649.0
      ],
      [
        299.64,
        586.0
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "F4",
    "row": 6,
    "col": 4,
    "cx": 463.32,
    "cy": 617.5,
    "points": [
      [
        463.32,
        554.5
      ],
      [
        517.88,
        586.0
      ],
      [
        517.88,
        649.0
      ],
      [
        463.32,
        680.5
      ],
      [
        408.76,
        649.0
      ],
      [
        408.76,
        586.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "F5",
    "row": 6,
    "col": 5,
    "cx": 572.44,
    "cy": 617.5,
    "points": [
      [
        572.44,
        554.5
      ],
      [
        627.0,
        586.0
      ],
      [
        627.0,
        649.0
      ],
      [
        572.44,
        680.5
      ],
      [
        517.88,
        649.0
      ],
      [
        517.88,
        586.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "settlement",
      "name": "Asentamiento Central",
      "description": "Asentamiento comercial especial en el centro."
    }
  },
  {
    "id": "F6",
    "row": 6,
    "col": 6,
    "cx": 681.56,
    "cy": 617.5,
    "points": [
      [
        681.56,
        554.5
      ],
      [
        736.12,
        586.0
      ],
      [
        736.12,
        649.0
      ],
      [
        681.56,
        680.5
      ],
      [
        627.0,
        649.0
      ],
      [
        627.0,
        586.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "church",
      "name": "Iglesia Central",
      "description": "Iglesia especial en la zona central."
    }
  },
  {
    "id": "F7",
    "row": 6,
    "col": 7,
    "cx": 790.68,
    "cy": 617.5,
    "points": [
      [
        790.68,
        554.5
      ],
      [
        845.24,
        586.0
      ],
      [
        845.24,
        649.0
      ],
      [
        790.68,
        680.5
      ],
      [
        736.12,
        649.0
      ],
      [
        736.12,
        586.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "F8",
    "row": 6,
    "col": 8,
    "cx": 899.8,
    "cy": 617.5,
    "points": [
      [
        899.8,
        554.5
      ],
      [
        954.36,
        586.0
      ],
      [
        954.36,
        649.0
      ],
      [
        899.8,
        680.5
      ],
      [
        845.24,
        649.0
      ],
      [
        845.24,
        586.0
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "F9",
    "row": 6,
    "col": 9,
    "cx": 1008.92,
    "cy": 617.5,
    "points": [
      [
        1008.92,
        554.5
      ],
      [
        1063.48,
        586.0
      ],
      [
        1063.48,
        649.0
      ],
      [
        1008.92,
        680.5
      ],
      [
        954.36,
        649.0
      ],
      [
        954.36,
        586.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "F10",
    "row": 6,
    "col": 10,
    "cx": 1118.04,
    "cy": 617.5,
    "points": [
      [
        1118.04,
        554.5
      ],
      [
        1172.6,
        586.0
      ],
      [
        1172.6,
        649.0
      ],
      [
        1118.04,
        680.5
      ],
      [
        1063.48,
        649.0
      ],
      [
        1063.48,
        586.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "port",
      "name": "Puerto Central Der.",
      "description": "Puerto colocado en la zona central derecha."
    }
  },
  {
    "id": "G1",
    "row": 7,
    "col": 1,
    "cx": 190.52,
    "cy": 712.0,
    "points": [
      [
        190.52,
        649.0
      ],
      [
        245.08,
        680.5
      ],
      [
        245.08,
        743.5
      ],
      [
        190.52,
        775.0
      ],
      [
        135.96,
        743.5
      ],
      [
        135.96,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G2",
    "row": 7,
    "col": 2,
    "cx": 299.64,
    "cy": 712.0,
    "points": [
      [
        299.64,
        649.0
      ],
      [
        354.2,
        680.5
      ],
      [
        354.2,
        743.5
      ],
      [
        299.64,
        775.0
      ],
      [
        245.08,
        743.5
      ],
      [
        245.08,
        680.5
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "G3",
    "row": 7,
    "col": 3,
    "cx": 408.76,
    "cy": 712.0,
    "points": [
      [
        408.76,
        649.0
      ],
      [
        463.32,
        680.5
      ],
      [
        463.32,
        743.5
      ],
      [
        408.76,
        775.0
      ],
      [
        354.2,
        743.5
      ],
      [
        354.2,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G4",
    "row": 7,
    "col": 4,
    "cx": 517.88,
    "cy": 712.0,
    "points": [
      [
        517.88,
        649.0
      ],
      [
        572.44,
        680.5
      ],
      [
        572.44,
        743.5
      ],
      [
        517.88,
        775.0
      ],
      [
        463.32,
        743.5
      ],
      [
        463.32,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G5",
    "row": 7,
    "col": 5,
    "cx": 627.0,
    "cy": 712.0,
    "points": [
      [
        627.0,
        649.0
      ],
      [
        681.56,
        680.5
      ],
      [
        681.56,
        743.5
      ],
      [
        627.0,
        775.0
      ],
      [
        572.44,
        743.5
      ],
      [
        572.44,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G6",
    "row": 7,
    "col": 6,
    "cx": 736.12,
    "cy": 712.0,
    "points": [
      [
        736.12,
        649.0
      ],
      [
        790.68,
        680.5
      ],
      [
        790.68,
        743.5
      ],
      [
        736.12,
        775.0
      ],
      [
        681.56,
        743.5
      ],
      [
        681.56,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G7",
    "row": 7,
    "col": 7,
    "cx": 845.24,
    "cy": 712.0,
    "points": [
      [
        845.24,
        649.0
      ],
      [
        899.8,
        680.5
      ],
      [
        899.8,
        743.5
      ],
      [
        845.24,
        775.0
      ],
      [
        790.68,
        743.5
      ],
      [
        790.68,
        680.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "G8",
    "row": 7,
    "col": 8,
    "cx": 954.36,
    "cy": 712.0,
    "points": [
      [
        954.36,
        649.0
      ],
      [
        1008.92,
        680.5
      ],
      [
        1008.92,
        743.5
      ],
      [
        954.36,
        775.0
      ],
      [
        899.8,
        743.5
      ],
      [
        899.8,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "G9",
    "row": 7,
    "col": 9,
    "cx": 1063.48,
    "cy": 712.0,
    "points": [
      [
        1063.48,
        649.0
      ],
      [
        1118.04,
        680.5
      ],
      [
        1118.04,
        743.5
      ],
      [
        1063.48,
        775.0
      ],
      [
        1008.92,
        743.5
      ],
      [
        1008.92,
        680.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "H1",
    "row": 8,
    "col": 1,
    "cx": 245.08,
    "cy": 806.5,
    "points": [
      [
        245.08,
        743.5
      ],
      [
        299.64,
        775.0
      ],
      [
        299.64,
        838.0
      ],
      [
        245.08,
        869.5
      ],
      [
        190.52,
        838.0
      ],
      [
        190.52,
        775.0
      ]
    ],
    "terrain": "pradera",
    "special": null
  },
  {
    "id": "H2",
    "row": 8,
    "col": 2,
    "cx": 354.2,
    "cy": 806.5,
    "points": [
      [
        354.2,
        743.5
      ],
      [
        408.76,
        775.0
      ],
      [
        408.76,
        838.0
      ],
      [
        354.2,
        869.5
      ],
      [
        299.64,
        838.0
      ],
      [
        299.64,
        775.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "H3",
    "row": 8,
    "col": 3,
    "cx": 463.32,
    "cy": 806.5,
    "points": [
      [
        463.32,
        743.5
      ],
      [
        517.88,
        775.0
      ],
      [
        517.88,
        838.0
      ],
      [
        463.32,
        869.5
      ],
      [
        408.76,
        838.0
      ],
      [
        408.76,
        775.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "settlement",
      "name": "Asentamiento H3",
      "description": "Asentamiento comercial especial."
    }
  },
  {
    "id": "H4",
    "row": 8,
    "col": 4,
    "cx": 572.44,
    "cy": 806.5,
    "points": [
      [
        572.44,
        743.5
      ],
      [
        627.0,
        775.0
      ],
      [
        627.0,
        838.0
      ],
      [
        572.44,
        869.5
      ],
      [
        517.88,
        838.0
      ],
      [
        517.88,
        775.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "H5",
    "row": 8,
    "col": 5,
    "cx": 681.56,
    "cy": 806.5,
    "points": [
      [
        681.56,
        743.5
      ],
      [
        736.12,
        775.0
      ],
      [
        736.12,
        838.0
      ],
      [
        681.56,
        869.5
      ],
      [
        627.0,
        838.0
      ],
      [
        627.0,
        775.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "H6",
    "row": 8,
    "col": 6,
    "cx": 790.68,
    "cy": 806.5,
    "points": [
      [
        790.68,
        743.5
      ],
      [
        845.24,
        775.0
      ],
      [
        845.24,
        838.0
      ],
      [
        790.68,
        869.5
      ],
      [
        736.12,
        838.0
      ],
      [
        736.12,
        775.0
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "church",
      "name": "Iglesia H6",
      "description": "Iglesia especial."
    }
  },
  {
    "id": "H7",
    "row": 8,
    "col": 7,
    "cx": 899.8,
    "cy": 806.5,
    "points": [
      [
        899.8,
        743.5
      ],
      [
        954.36,
        775.0
      ],
      [
        954.36,
        838.0
      ],
      [
        899.8,
        869.5
      ],
      [
        845.24,
        838.0
      ],
      [
        845.24,
        775.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "H8",
    "row": 8,
    "col": 8,
    "cx": 1008.92,
    "cy": 806.5,
    "points": [
      [
        1008.92,
        743.5
      ],
      [
        1063.48,
        775.0
      ],
      [
        1063.48,
        838.0
      ],
      [
        1008.92,
        869.5
      ],
      [
        954.36,
        838.0
      ],
      [
        954.36,
        775.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I1",
    "row": 9,
    "col": 1,
    "cx": 299.64,
    "cy": 901.0,
    "points": [
      [
        299.64,
        838.0
      ],
      [
        354.2,
        869.5
      ],
      [
        354.2,
        932.5
      ],
      [
        299.64,
        964.0
      ],
      [
        245.08,
        932.5
      ],
      [
        245.08,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I2",
    "row": 9,
    "col": 2,
    "cx": 408.76,
    "cy": 901.0,
    "points": [
      [
        408.76,
        838.0
      ],
      [
        463.32,
        869.5
      ],
      [
        463.32,
        932.5
      ],
      [
        408.76,
        964.0
      ],
      [
        354.2,
        932.5
      ],
      [
        354.2,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I3",
    "row": 9,
    "col": 3,
    "cx": 517.88,
    "cy": 901.0,
    "points": [
      [
        517.88,
        838.0
      ],
      [
        572.44,
        869.5
      ],
      [
        572.44,
        932.5
      ],
      [
        517.88,
        964.0
      ],
      [
        463.32,
        932.5
      ],
      [
        463.32,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I4",
    "row": 9,
    "col": 4,
    "cx": 627.0,
    "cy": 901.0,
    "points": [
      [
        627.0,
        838.0
      ],
      [
        681.56,
        869.5
      ],
      [
        681.56,
        932.5
      ],
      [
        627.0,
        964.0
      ],
      [
        572.44,
        932.5
      ],
      [
        572.44,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I5",
    "row": 9,
    "col": 5,
    "cx": 736.12,
    "cy": 901.0,
    "points": [
      [
        736.12,
        838.0
      ],
      [
        790.68,
        869.5
      ],
      [
        790.68,
        932.5
      ],
      [
        736.12,
        964.0
      ],
      [
        681.56,
        932.5
      ],
      [
        681.56,
        869.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "I6",
    "row": 9,
    "col": 6,
    "cx": 845.24,
    "cy": 901.0,
    "points": [
      [
        845.24,
        838.0
      ],
      [
        899.8,
        869.5
      ],
      [
        899.8,
        932.5
      ],
      [
        845.24,
        964.0
      ],
      [
        790.68,
        932.5
      ],
      [
        790.68,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "I7",
    "row": 9,
    "col": 7,
    "cx": 954.36,
    "cy": 901.0,
    "points": [
      [
        954.36,
        838.0
      ],
      [
        1008.92,
        869.5
      ],
      [
        1008.92,
        932.5
      ],
      [
        954.36,
        964.0
      ],
      [
        899.8,
        932.5
      ],
      [
        899.8,
        869.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "J1",
    "row": 10,
    "col": 1,
    "cx": 354.2,
    "cy": 995.5,
    "points": [
      [
        354.2,
        932.5
      ],
      [
        408.76,
        964.0
      ],
      [
        408.76,
        1027.0
      ],
      [
        354.2,
        1058.5
      ],
      [
        299.64,
        1027.0
      ],
      [
        299.64,
        964.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "J2",
    "row": 10,
    "col": 2,
    "cx": 463.32,
    "cy": 995.5,
    "points": [
      [
        463.32,
        932.5
      ],
      [
        517.88,
        964.0
      ],
      [
        517.88,
        1027.0
      ],
      [
        463.32,
        1058.5
      ],
      [
        408.76,
        1027.0
      ],
      [
        408.76,
        964.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "J3",
    "row": 10,
    "col": 3,
    "cx": 572.44,
    "cy": 995.5,
    "points": [
      [
        572.44,
        932.5
      ],
      [
        627.0,
        964.0
      ],
      [
        627.0,
        1027.0
      ],
      [
        572.44,
        1058.5
      ],
      [
        517.88,
        1027.0
      ],
      [
        517.88,
        964.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "J4",
    "row": 10,
    "col": 4,
    "cx": 681.56,
    "cy": 995.5,
    "points": [
      [
        681.56,
        932.5
      ],
      [
        736.12,
        964.0
      ],
      [
        736.12,
        1027.0
      ],
      [
        681.56,
        1058.5
      ],
      [
        627.0,
        1027.0
      ],
      [
        627.0,
        964.0
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "J5",
    "row": 10,
    "col": 5,
    "cx": 790.68,
    "cy": 995.5,
    "points": [
      [
        790.68,
        932.5
      ],
      [
        845.24,
        964.0
      ],
      [
        845.24,
        1027.0
      ],
      [
        790.68,
        1058.5
      ],
      [
        736.12,
        1027.0
      ],
      [
        736.12,
        964.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "J6",
    "row": 10,
    "col": 6,
    "cx": 899.8,
    "cy": 995.5,
    "points": [
      [
        899.8,
        932.5
      ],
      [
        954.36,
        964.0
      ],
      [
        954.36,
        1027.0
      ],
      [
        899.8,
        1058.5
      ],
      [
        845.24,
        1027.0
      ],
      [
        845.24,
        964.0
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "K1",
    "row": 11,
    "col": 1,
    "cx": 408.76,
    "cy": 1090.0,
    "points": [
      [
        408.76,
        1027.0
      ],
      [
        463.32,
        1058.5
      ],
      [
        463.32,
        1121.5
      ],
      [
        408.76,
        1153.0
      ],
      [
        354.2,
        1121.5
      ],
      [
        354.2,
        1058.5
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "exploration",
      "name": "Exploración Inf. Izq.",
      "description": "Puesto de exploración colocado en la esquina inferior izquierda."
    }
  },
  {
    "id": "K2",
    "row": 11,
    "col": 2,
    "cx": 517.88,
    "cy": 1090.0,
    "points": [
      [
        517.88,
        1027.0
      ],
      [
        572.44,
        1058.5
      ],
      [
        572.44,
        1121.5
      ],
      [
        517.88,
        1153.0
      ],
      [
        463.32,
        1121.5
      ],
      [
        463.32,
        1058.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "K3",
    "row": 11,
    "col": 3,
    "cx": 627.0,
    "cy": 1090.0,
    "points": [
      [
        627.0,
        1027.0
      ],
      [
        681.56,
        1058.5
      ],
      [
        681.56,
        1121.5
      ],
      [
        627.0,
        1153.0
      ],
      [
        572.44,
        1121.5
      ],
      [
        572.44,
        1058.5
      ]
    ],
    "terrain": "bosque",
    "special": null
  },
  {
    "id": "K4",
    "row": 11,
    "col": 4,
    "cx": 736.12,
    "cy": 1090.0,
    "points": [
      [
        736.12,
        1027.0
      ],
      [
        790.68,
        1058.5
      ],
      [
        790.68,
        1121.5
      ],
      [
        736.12,
        1153.0
      ],
      [
        681.56,
        1121.5
      ],
      [
        681.56,
        1058.5
      ]
    ],
    "terrain": "llanura",
    "special": null
  },
  {
    "id": "K5",
    "row": 11,
    "col": 5,
    "cx": 845.24,
    "cy": 1090.0,
    "points": [
      [
        845.24,
        1027.0
      ],
      [
        899.8,
        1058.5
      ],
      [
        899.8,
        1121.5
      ],
      [
        845.24,
        1153.0
      ],
      [
        790.68,
        1121.5
      ],
      [
        790.68,
        1058.5
      ]
    ],
    "terrain": "especial",
    "special": {
      "kind": "port",
      "name": "Puerto del Sur",
      "description": "Puerto neutral comercial del extremo inferior derecho."
    }
  }
];
const vertices = [
  {
    "x": 408.76,
    "y": 82.0,
    "linkedCells": [
      "A1"
    ]
  },
  {
    "x": 463.32,
    "y": 113.5,
    "linkedCells": [
      "A1",
      "A2"
    ]
  },
  {
    "x": 463.32,
    "y": 176.5,
    "linkedCells": [
      "A1",
      "A2",
      "B2"
    ]
  },
  {
    "x": 408.76,
    "y": 208.0,
    "linkedCells": [
      "A1",
      "B1",
      "B2"
    ]
  },
  {
    "x": 354.2,
    "y": 176.5,
    "linkedCells": [
      "A1",
      "B1"
    ]
  },
  {
    "x": 354.2,
    "y": 113.5,
    "linkedCells": [
      "A1"
    ]
  },
  {
    "x": 517.88,
    "y": 82.0,
    "linkedCells": [
      "A2"
    ]
  },
  {
    "x": 572.44,
    "y": 113.5,
    "linkedCells": [
      "A2",
      "A3"
    ]
  },
  {
    "x": 572.44,
    "y": 176.5,
    "linkedCells": [
      "A2",
      "A3",
      "B3"
    ]
  },
  {
    "x": 517.88,
    "y": 208.0,
    "linkedCells": [
      "A2",
      "B2",
      "B3"
    ]
  },
  {
    "x": 627.0,
    "y": 82.0,
    "linkedCells": [
      "A3"
    ]
  },
  {
    "x": 681.56,
    "y": 113.5,
    "linkedCells": [
      "A3",
      "A4"
    ]
  },
  {
    "x": 681.56,
    "y": 176.5,
    "linkedCells": [
      "A3",
      "A4",
      "B4"
    ]
  },
  {
    "x": 627.0,
    "y": 208.0,
    "linkedCells": [
      "A3",
      "B3",
      "B4"
    ]
  },
  {
    "x": 736.12,
    "y": 82.0,
    "linkedCells": [
      "A4"
    ]
  },
  {
    "x": 790.68,
    "y": 113.5,
    "linkedCells": [
      "A4",
      "A5"
    ]
  },
  {
    "x": 790.68,
    "y": 176.5,
    "linkedCells": [
      "A4",
      "A5",
      "B5"
    ]
  },
  {
    "x": 736.12,
    "y": 208.0,
    "linkedCells": [
      "A4",
      "B4",
      "B5"
    ]
  },
  {
    "x": 845.24,
    "y": 82.0,
    "linkedCells": [
      "A5"
    ]
  },
  {
    "x": 899.8,
    "y": 113.5,
    "linkedCells": [
      "A5"
    ]
  },
  {
    "x": 899.8,
    "y": 176.5,
    "linkedCells": [
      "A5",
      "B6"
    ]
  },
  {
    "x": 845.24,
    "y": 208.0,
    "linkedCells": [
      "A5",
      "B5",
      "B6"
    ]
  },
  {
    "x": 408.76,
    "y": 271.0,
    "linkedCells": [
      "B1",
      "B2",
      "C2"
    ]
  },
  {
    "x": 354.2,
    "y": 302.5,
    "linkedCells": [
      "B1",
      "C1",
      "C2"
    ]
  },
  {
    "x": 299.64,
    "y": 271.0,
    "linkedCells": [
      "B1",
      "C1"
    ]
  },
  {
    "x": 299.64,
    "y": 208.0,
    "linkedCells": [
      "B1"
    ]
  },
  {
    "x": 517.88,
    "y": 271.0,
    "linkedCells": [
      "B2",
      "B3",
      "C3"
    ]
  },
  {
    "x": 463.32,
    "y": 302.5,
    "linkedCells": [
      "B2",
      "C2",
      "C3"
    ]
  },
  {
    "x": 627.0,
    "y": 271.0,
    "linkedCells": [
      "B3",
      "B4",
      "C4"
    ]
  },
  {
    "x": 572.44,
    "y": 302.5,
    "linkedCells": [
      "B3",
      "C3",
      "C4"
    ]
  },
  {
    "x": 736.12,
    "y": 271.0,
    "linkedCells": [
      "B4",
      "B5",
      "C5"
    ]
  },
  {
    "x": 681.56,
    "y": 302.5,
    "linkedCells": [
      "B4",
      "C4",
      "C5"
    ]
  },
  {
    "x": 845.24,
    "y": 271.0,
    "linkedCells": [
      "B5",
      "B6",
      "C6"
    ]
  },
  {
    "x": 790.68,
    "y": 302.5,
    "linkedCells": [
      "B5",
      "C5",
      "C6"
    ]
  },
  {
    "x": 954.36,
    "y": 208.0,
    "linkedCells": [
      "B6"
    ]
  },
  {
    "x": 954.36,
    "y": 271.0,
    "linkedCells": [
      "B6",
      "C7"
    ]
  },
  {
    "x": 899.8,
    "y": 302.5,
    "linkedCells": [
      "B6",
      "C6",
      "C7"
    ]
  },
  {
    "x": 354.2,
    "y": 365.5,
    "linkedCells": [
      "C1",
      "C2",
      "D2"
    ]
  },
  {
    "x": 299.64,
    "y": 397.0,
    "linkedCells": [
      "C1",
      "D1",
      "D2"
    ]
  },
  {
    "x": 245.08,
    "y": 365.5,
    "linkedCells": [
      "C1",
      "D1"
    ]
  },
  {
    "x": 245.08,
    "y": 302.5,
    "linkedCells": [
      "C1"
    ]
  },
  {
    "x": 463.32,
    "y": 365.5,
    "linkedCells": [
      "C2",
      "C3",
      "D3"
    ]
  },
  {
    "x": 408.76,
    "y": 397.0,
    "linkedCells": [
      "C2",
      "D2",
      "D3"
    ]
  },
  {
    "x": 572.44,
    "y": 365.5,
    "linkedCells": [
      "C3",
      "C4",
      "D4"
    ]
  },
  {
    "x": 517.88,
    "y": 397.0,
    "linkedCells": [
      "C3",
      "D3",
      "D4"
    ]
  },
  {
    "x": 681.56,
    "y": 365.5,
    "linkedCells": [
      "C4",
      "C5",
      "D5"
    ]
  },
  {
    "x": 627.0,
    "y": 397.0,
    "linkedCells": [
      "C4",
      "D4",
      "D5"
    ]
  },
  {
    "x": 790.68,
    "y": 365.5,
    "linkedCells": [
      "C5",
      "C6",
      "D6"
    ]
  },
  {
    "x": 736.12,
    "y": 397.0,
    "linkedCells": [
      "C5",
      "D5",
      "D6"
    ]
  },
  {
    "x": 899.8,
    "y": 365.5,
    "linkedCells": [
      "C6",
      "C7",
      "D7"
    ]
  },
  {
    "x": 845.24,
    "y": 397.0,
    "linkedCells": [
      "C6",
      "D6",
      "D7"
    ]
  },
  {
    "x": 1008.92,
    "y": 302.5,
    "linkedCells": [
      "C7"
    ]
  },
  {
    "x": 1008.92,
    "y": 365.5,
    "linkedCells": [
      "C7",
      "D8"
    ]
  },
  {
    "x": 954.36,
    "y": 397.0,
    "linkedCells": [
      "C7",
      "D7",
      "D8"
    ]
  },
  {
    "x": 299.64,
    "y": 460.0,
    "linkedCells": [
      "D1",
      "D2",
      "E2"
    ]
  },
  {
    "x": 245.08,
    "y": 491.5,
    "linkedCells": [
      "D1",
      "E1",
      "E2"
    ]
  },
  {
    "x": 190.52,
    "y": 460.0,
    "linkedCells": [
      "D1",
      "E1"
    ]
  },
  {
    "x": 190.52,
    "y": 397.0,
    "linkedCells": [
      "D1"
    ]
  },
  {
    "x": 408.76,
    "y": 460.0,
    "linkedCells": [
      "D2",
      "D3",
      "E3"
    ]
  },
  {
    "x": 354.2,
    "y": 491.5,
    "linkedCells": [
      "D2",
      "E2",
      "E3"
    ]
  },
  {
    "x": 517.88,
    "y": 460.0,
    "linkedCells": [
      "D3",
      "D4",
      "E4"
    ]
  },
  {
    "x": 463.32,
    "y": 491.5,
    "linkedCells": [
      "D3",
      "E3",
      "E4"
    ]
  },
  {
    "x": 627.0,
    "y": 460.0,
    "linkedCells": [
      "D4",
      "D5",
      "E5"
    ]
  },
  {
    "x": 572.44,
    "y": 491.5,
    "linkedCells": [
      "D4",
      "E4",
      "E5"
    ]
  },
  {
    "x": 736.12,
    "y": 460.0,
    "linkedCells": [
      "D5",
      "D6",
      "E6"
    ]
  },
  {
    "x": 681.56,
    "y": 491.5,
    "linkedCells": [
      "D5",
      "E5",
      "E6"
    ]
  },
  {
    "x": 845.24,
    "y": 460.0,
    "linkedCells": [
      "D6",
      "D7",
      "E7"
    ]
  },
  {
    "x": 790.68,
    "y": 491.5,
    "linkedCells": [
      "D6",
      "E6",
      "E7"
    ]
  },
  {
    "x": 954.36,
    "y": 460.0,
    "linkedCells": [
      "D7",
      "D8",
      "E8"
    ]
  },
  {
    "x": 899.8,
    "y": 491.5,
    "linkedCells": [
      "D7",
      "E7",
      "E8"
    ]
  },
  {
    "x": 1063.48,
    "y": 397.0,
    "linkedCells": [
      "D8"
    ]
  },
  {
    "x": 1063.48,
    "y": 460.0,
    "linkedCells": [
      "D8",
      "E9"
    ]
  },
  {
    "x": 1008.92,
    "y": 491.5,
    "linkedCells": [
      "D8",
      "E8",
      "E9"
    ]
  },
  {
    "x": 245.08,
    "y": 554.5,
    "linkedCells": [
      "E1",
      "E2",
      "F2"
    ]
  },
  {
    "x": 190.52,
    "y": 586.0,
    "linkedCells": [
      "E1",
      "F1",
      "F2"
    ]
  },
  {
    "x": 135.96,
    "y": 554.5,
    "linkedCells": [
      "E1",
      "F1"
    ]
  },
  {
    "x": 135.96,
    "y": 491.5,
    "linkedCells": [
      "E1"
    ]
  },
  {
    "x": 354.2,
    "y": 554.5,
    "linkedCells": [
      "E2",
      "E3",
      "F3"
    ]
  },
  {
    "x": 299.64,
    "y": 586.0,
    "linkedCells": [
      "E2",
      "F2",
      "F3"
    ]
  },
  {
    "x": 463.32,
    "y": 554.5,
    "linkedCells": [
      "E3",
      "E4",
      "F4"
    ]
  },
  {
    "x": 408.76,
    "y": 586.0,
    "linkedCells": [
      "E3",
      "F3",
      "F4"
    ]
  },
  {
    "x": 572.44,
    "y": 554.5,
    "linkedCells": [
      "E4",
      "E5",
      "F5"
    ]
  },
  {
    "x": 517.88,
    "y": 586.0,
    "linkedCells": [
      "E4",
      "F4",
      "F5"
    ]
  },
  {
    "x": 681.56,
    "y": 554.5,
    "linkedCells": [
      "E5",
      "E6",
      "F6"
    ]
  },
  {
    "x": 627.0,
    "y": 586.0,
    "linkedCells": [
      "E5",
      "F5",
      "F6"
    ]
  },
  {
    "x": 790.68,
    "y": 554.5,
    "linkedCells": [
      "E6",
      "E7",
      "F7"
    ]
  },
  {
    "x": 736.12,
    "y": 586.0,
    "linkedCells": [
      "E6",
      "F6",
      "F7"
    ]
  },
  {
    "x": 899.8,
    "y": 554.5,
    "linkedCells": [
      "E7",
      "E8",
      "F8"
    ]
  },
  {
    "x": 845.24,
    "y": 586.0,
    "linkedCells": [
      "E7",
      "F7",
      "F8"
    ]
  },
  {
    "x": 1008.92,
    "y": 554.5,
    "linkedCells": [
      "E8",
      "E9",
      "F9"
    ]
  },
  {
    "x": 954.36,
    "y": 586.0,
    "linkedCells": [
      "E8",
      "F8",
      "F9"
    ]
  },
  {
    "x": 1118.04,
    "y": 491.5,
    "linkedCells": [
      "E9"
    ]
  },
  {
    "x": 1118.04,
    "y": 554.5,
    "linkedCells": [
      "E9",
      "F10"
    ]
  },
  {
    "x": 1063.48,
    "y": 586.0,
    "linkedCells": [
      "E9",
      "F9",
      "F10"
    ]
  },
  {
    "x": 190.52,
    "y": 649.0,
    "linkedCells": [
      "F1",
      "F2",
      "G1"
    ]
  },
  {
    "x": 135.96,
    "y": 680.5,
    "linkedCells": [
      "F1",
      "G1"
    ]
  },
  {
    "x": 81.4,
    "y": 649.0,
    "linkedCells": [
      "F1"
    ]
  },
  {
    "x": 81.4,
    "y": 586.0,
    "linkedCells": [
      "F1"
    ]
  },
  {
    "x": 299.64,
    "y": 649.0,
    "linkedCells": [
      "F2",
      "F3",
      "G2"
    ]
  },
  {
    "x": 245.08,
    "y": 680.5,
    "linkedCells": [
      "F2",
      "G1",
      "G2"
    ]
  },
  {
    "x": 408.76,
    "y": 649.0,
    "linkedCells": [
      "F3",
      "F4",
      "G3"
    ]
  },
  {
    "x": 354.2,
    "y": 680.5,
    "linkedCells": [
      "F3",
      "G2",
      "G3"
    ]
  },
  {
    "x": 517.88,
    "y": 649.0,
    "linkedCells": [
      "F4",
      "F5",
      "G4"
    ]
  },
  {
    "x": 463.32,
    "y": 680.5,
    "linkedCells": [
      "F4",
      "G3",
      "G4"
    ]
  },
  {
    "x": 627.0,
    "y": 649.0,
    "linkedCells": [
      "F5",
      "F6",
      "G5"
    ]
  },
  {
    "x": 572.44,
    "y": 680.5,
    "linkedCells": [
      "F5",
      "G4",
      "G5"
    ]
  },
  {
    "x": 736.12,
    "y": 649.0,
    "linkedCells": [
      "F6",
      "F7",
      "G6"
    ]
  },
  {
    "x": 681.56,
    "y": 680.5,
    "linkedCells": [
      "F6",
      "G5",
      "G6"
    ]
  },
  {
    "x": 845.24,
    "y": 649.0,
    "linkedCells": [
      "F7",
      "F8",
      "G7"
    ]
  },
  {
    "x": 790.68,
    "y": 680.5,
    "linkedCells": [
      "F7",
      "G6",
      "G7"
    ]
  },
  {
    "x": 954.36,
    "y": 649.0,
    "linkedCells": [
      "F8",
      "F9",
      "G8"
    ]
  },
  {
    "x": 899.8,
    "y": 680.5,
    "linkedCells": [
      "F8",
      "G7",
      "G8"
    ]
  },
  {
    "x": 1063.48,
    "y": 649.0,
    "linkedCells": [
      "F9",
      "F10",
      "G9"
    ]
  },
  {
    "x": 1008.92,
    "y": 680.5,
    "linkedCells": [
      "F9",
      "G8",
      "G9"
    ]
  },
  {
    "x": 1172.6,
    "y": 586.0,
    "linkedCells": [
      "F10"
    ]
  },
  {
    "x": 1172.6,
    "y": 649.0,
    "linkedCells": [
      "F10"
    ]
  },
  {
    "x": 1118.04,
    "y": 680.5,
    "linkedCells": [
      "F10",
      "G9"
    ]
  },
  {
    "x": 245.08,
    "y": 743.5,
    "linkedCells": [
      "G1",
      "G2",
      "H1"
    ]
  },
  {
    "x": 190.52,
    "y": 775.0,
    "linkedCells": [
      "G1",
      "H1"
    ]
  },
  {
    "x": 135.96,
    "y": 743.5,
    "linkedCells": [
      "G1"
    ]
  },
  {
    "x": 354.2,
    "y": 743.5,
    "linkedCells": [
      "G2",
      "G3",
      "H2"
    ]
  },
  {
    "x": 299.64,
    "y": 775.0,
    "linkedCells": [
      "G2",
      "H1",
      "H2"
    ]
  },
  {
    "x": 463.32,
    "y": 743.5,
    "linkedCells": [
      "G3",
      "G4",
      "H3"
    ]
  },
  {
    "x": 408.76,
    "y": 775.0,
    "linkedCells": [
      "G3",
      "H2",
      "H3"
    ]
  },
  {
    "x": 572.44,
    "y": 743.5,
    "linkedCells": [
      "G4",
      "G5",
      "H4"
    ]
  },
  {
    "x": 517.88,
    "y": 775.0,
    "linkedCells": [
      "G4",
      "H3",
      "H4"
    ]
  },
  {
    "x": 681.56,
    "y": 743.5,
    "linkedCells": [
      "G5",
      "G6",
      "H5"
    ]
  },
  {
    "x": 627.0,
    "y": 775.0,
    "linkedCells": [
      "G5",
      "H4",
      "H5"
    ]
  },
  {
    "x": 790.68,
    "y": 743.5,
    "linkedCells": [
      "G6",
      "G7",
      "H6"
    ]
  },
  {
    "x": 736.12,
    "y": 775.0,
    "linkedCells": [
      "G6",
      "H5",
      "H6"
    ]
  },
  {
    "x": 899.8,
    "y": 743.5,
    "linkedCells": [
      "G7",
      "G8",
      "H7"
    ]
  },
  {
    "x": 845.24,
    "y": 775.0,
    "linkedCells": [
      "G7",
      "H6",
      "H7"
    ]
  },
  {
    "x": 1008.92,
    "y": 743.5,
    "linkedCells": [
      "G8",
      "G9",
      "H8"
    ]
  },
  {
    "x": 954.36,
    "y": 775.0,
    "linkedCells": [
      "G8",
      "H7",
      "H8"
    ]
  },
  {
    "x": 1118.04,
    "y": 743.5,
    "linkedCells": [
      "G9"
    ]
  },
  {
    "x": 1063.48,
    "y": 775.0,
    "linkedCells": [
      "G9",
      "H8"
    ]
  },
  {
    "x": 299.64,
    "y": 838.0,
    "linkedCells": [
      "H1",
      "H2",
      "I1"
    ]
  },
  {
    "x": 245.08,
    "y": 869.5,
    "linkedCells": [
      "H1",
      "I1"
    ]
  },
  {
    "x": 190.52,
    "y": 838.0,
    "linkedCells": [
      "H1"
    ]
  },
  {
    "x": 408.76,
    "y": 838.0,
    "linkedCells": [
      "H2",
      "H3",
      "I2"
    ]
  },
  {
    "x": 354.2,
    "y": 869.5,
    "linkedCells": [
      "H2",
      "I1",
      "I2"
    ]
  },
  {
    "x": 517.88,
    "y": 838.0,
    "linkedCells": [
      "H3",
      "H4",
      "I3"
    ]
  },
  {
    "x": 463.32,
    "y": 869.5,
    "linkedCells": [
      "H3",
      "I2",
      "I3"
    ]
  },
  {
    "x": 627.0,
    "y": 838.0,
    "linkedCells": [
      "H4",
      "H5",
      "I4"
    ]
  },
  {
    "x": 572.44,
    "y": 869.5,
    "linkedCells": [
      "H4",
      "I3",
      "I4"
    ]
  },
  {
    "x": 736.12,
    "y": 838.0,
    "linkedCells": [
      "H5",
      "H6",
      "I5"
    ]
  },
  {
    "x": 681.56,
    "y": 869.5,
    "linkedCells": [
      "H5",
      "I4",
      "I5"
    ]
  },
  {
    "x": 845.24,
    "y": 838.0,
    "linkedCells": [
      "H6",
      "H7",
      "I6"
    ]
  },
  {
    "x": 790.68,
    "y": 869.5,
    "linkedCells": [
      "H6",
      "I5",
      "I6"
    ]
  },
  {
    "x": 954.36,
    "y": 838.0,
    "linkedCells": [
      "H7",
      "H8",
      "I7"
    ]
  },
  {
    "x": 899.8,
    "y": 869.5,
    "linkedCells": [
      "H7",
      "I6",
      "I7"
    ]
  },
  {
    "x": 1063.48,
    "y": 838.0,
    "linkedCells": [
      "H8"
    ]
  },
  {
    "x": 1008.92,
    "y": 869.5,
    "linkedCells": [
      "H8",
      "I7"
    ]
  },
  {
    "x": 354.2,
    "y": 932.5,
    "linkedCells": [
      "I1",
      "I2",
      "J1"
    ]
  },
  {
    "x": 299.64,
    "y": 964.0,
    "linkedCells": [
      "I1",
      "J1"
    ]
  },
  {
    "x": 245.08,
    "y": 932.5,
    "linkedCells": [
      "I1"
    ]
  },
  {
    "x": 463.32,
    "y": 932.5,
    "linkedCells": [
      "I2",
      "I3",
      "J2"
    ]
  },
  {
    "x": 408.76,
    "y": 964.0,
    "linkedCells": [
      "I2",
      "J1",
      "J2"
    ]
  },
  {
    "x": 572.44,
    "y": 932.5,
    "linkedCells": [
      "I3",
      "I4",
      "J3"
    ]
  },
  {
    "x": 517.88,
    "y": 964.0,
    "linkedCells": [
      "I3",
      "J2",
      "J3"
    ]
  },
  {
    "x": 681.56,
    "y": 932.5,
    "linkedCells": [
      "I4",
      "I5",
      "J4"
    ]
  },
  {
    "x": 627.0,
    "y": 964.0,
    "linkedCells": [
      "I4",
      "J3",
      "J4"
    ]
  },
  {
    "x": 790.68,
    "y": 932.5,
    "linkedCells": [
      "I5",
      "I6",
      "J5"
    ]
  },
  {
    "x": 736.12,
    "y": 964.0,
    "linkedCells": [
      "I5",
      "J4",
      "J5"
    ]
  },
  {
    "x": 899.8,
    "y": 932.5,
    "linkedCells": [
      "I6",
      "I7",
      "J6"
    ]
  },
  {
    "x": 845.24,
    "y": 964.0,
    "linkedCells": [
      "I6",
      "J5",
      "J6"
    ]
  },
  {
    "x": 1008.92,
    "y": 932.5,
    "linkedCells": [
      "I7"
    ]
  },
  {
    "x": 954.36,
    "y": 964.0,
    "linkedCells": [
      "I7",
      "J6"
    ]
  },
  {
    "x": 408.76,
    "y": 1027.0,
    "linkedCells": [
      "J1",
      "J2",
      "K1"
    ]
  },
  {
    "x": 354.2,
    "y": 1058.5,
    "linkedCells": [
      "J1",
      "K1"
    ]
  },
  {
    "x": 299.64,
    "y": 1027.0,
    "linkedCells": [
      "J1"
    ]
  },
  {
    "x": 517.88,
    "y": 1027.0,
    "linkedCells": [
      "J2",
      "J3",
      "K2"
    ]
  },
  {
    "x": 463.32,
    "y": 1058.5,
    "linkedCells": [
      "J2",
      "K1",
      "K2"
    ]
  },
  {
    "x": 627.0,
    "y": 1027.0,
    "linkedCells": [
      "J3",
      "J4",
      "K3"
    ]
  },
  {
    "x": 572.44,
    "y": 1058.5,
    "linkedCells": [
      "J3",
      "K2",
      "K3"
    ]
  },
  {
    "x": 736.12,
    "y": 1027.0,
    "linkedCells": [
      "J4",
      "J5",
      "K4"
    ]
  },
  {
    "x": 681.56,
    "y": 1058.5,
    "linkedCells": [
      "J4",
      "K3",
      "K4"
    ]
  },
  {
    "x": 845.24,
    "y": 1027.0,
    "linkedCells": [
      "J5",
      "J6",
      "K5"
    ]
  },
  {
    "x": 790.68,
    "y": 1058.5,
    "linkedCells": [
      "J5",
      "K4",
      "K5"
    ]
  },
  {
    "x": 954.36,
    "y": 1027.0,
    "linkedCells": [
      "J6"
    ]
  },
  {
    "x": 899.8,
    "y": 1058.5,
    "linkedCells": [
      "J6",
      "K5"
    ]
  },
  {
    "x": 463.32,
    "y": 1121.5,
    "linkedCells": [
      "K1",
      "K2"
    ]
  },
  {
    "x": 408.76,
    "y": 1153.0,
    "linkedCells": [
      "K1"
    ]
  },
  {
    "x": 354.2,
    "y": 1121.5,
    "linkedCells": [
      "K1"
    ]
  },
  {
    "x": 572.44,
    "y": 1121.5,
    "linkedCells": [
      "K2",
      "K3"
    ]
  },
  {
    "x": 517.88,
    "y": 1153.0,
    "linkedCells": [
      "K2"
    ]
  },
  {
    "x": 681.56,
    "y": 1121.5,
    "linkedCells": [
      "K3",
      "K4"
    ]
  },
  {
    "x": 627.0,
    "y": 1153.0,
    "linkedCells": [
      "K3"
    ]
  },
  {
    "x": 790.68,
    "y": 1121.5,
    "linkedCells": [
      "K4",
      "K5"
    ]
  },
  {
    "x": 736.12,
    "y": 1153.0,
    "linkedCells": [
      "K4"
    ]
  },
  {
    "x": 899.8,
    "y": 1121.5,
    "linkedCells": [
      "K5"
    ]
  },
  {
    "x": 845.24,
    "y": 1153.0,
    "linkedCells": [
      "K5"
    ]
  }
];
const resourceAssets = { wood: "assets/resources/wood.png", stone: "assets/resources/stone.png", gold: "assets/resources/gold.png", metal: "assets/resources/metal.png", food: "assets/resources/food.png" };
const resourceNames = { wood: "Madera", stone: "Piedra", gold: "Oro", metal: "Metales", food: "Comida" };
const buildingAssets = {
  port: {
    neutral: "assets/buildings/port.png",
    blue: "assets/buildings/port-blue.png",
    red: "assets/buildings/port-red.png"
  },
  settlement: {
    neutral: "assets/buildings/settlement.png",
    blue: "assets/buildings/settlement-blue.png",
    red: "assets/buildings/settlement-red.png"
  },
  church: {
    neutral: "assets/buildings/church.png",
    blue: "assets/buildings/church-blue.png",
    red: "assets/buildings/church-red.png"
  },
  exploration: {
    neutral: "assets/buildings/exploration.png",
    blue: "assets/buildings/exploration-blue.png",
    red: "assets/buildings/exploration-red.png"
  }
,
  urban: {
    neutral: "assets/buildings/urban-blue.png",
    blue: "assets/buildings/urban-blue.png",
    red: "assets/buildings/urban-red.png"
  },
  market: {
    neutral: "assets/buildings/market-blue.png",
    blue: "assets/buildings/market-blue.png",
    red: "assets/buildings/market-red.png"
  },
  house: {
    neutral: "assets/buildings/house-blue.png",
    blue: "assets/buildings/house-blue.png",
    red: "assets/buildings/house-red.png"
  },
  extraction: {
    neutral: "assets/buildings/extraction-blue.png",
    blue: "assets/buildings/extraction-blue.png",
    red: "assets/buildings/extraction-red.png"
  },
  militaryComplex: {
    neutral: "assets/buildings/military-complex-blue.png",
    blue: "assets/buildings/military-complex-blue.png",
    red: "assets/buildings/military-complex-red.png"
  },
  militaryCamp: {
    neutral: "assets/buildings/military-camp-blue.png",
    blue: "assets/buildings/military-camp-blue.png",
    red: "assets/buildings/military-camp-red.png"
  }
};
const categoryAssets = { diplomatico: "assets/categories/diplomatico.png", economico: "assets/categories/economico.png", militar: "assets/categories/militar.png", sagrado: "assets/categories/sagrado.png", civil: "assets/categories/civil.png" };
const specialClass = { port: "special-port", exploration: "special-exploration", settlement: "special-settlement", church: "special-church", urban: "special-urban", market: "special-urban", house: "special-urban", extraction: "special-urban", militaryComplex: "special-exploration", militaryCamp: "special-exploration" };
const specialTypeNames = { port: "Puerto", exploration: "Exploración", settlement: "Asentamiento comercial", church: "Iglesia", urban: "Asentamiento urbano", house: "Casa", market: "Mercado", extraction: "Base de extracción", militaryComplex: "Complejo militar", militaryCamp: "Campamento militar" };
const quickCreatableTypes = ['villager', 'house', 'market', 'urban', 'extraction', 'militaryComplex', 'militaryCamp'];
const RESOURCE_COUNTS = { wood: 6, stone: 4, gold: 4, food: 6, metal: 3 };
const MARITIME_MONOPOLY_RESOURCES = ['wood', 'stone', 'gold', 'food', 'metal'];
let maritimeContracts = {};

const buildingCards = {
  A1: {
    id: "puerto-norte",
    tileId: "A1",
    name: "Puerto del Norte",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puerto",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/puerto-del-norte-bg.png",
    acquisitionCost: { gold: 3, food: 2 },
    reconstructionCost: { wood: 4, stone: 3 },
    annualBenefit: {},
    maritimeContractCost: { gold: 3 },
    annualContractTax: {},
    monopolyResource: null,
    monopolyOwner: null
  },
  F10: {
    id: "puerto-este",
    tileId: "F10",
    name: "Puerto del Este",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puerto",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/puerto-del-este-bg.png",
    acquisitionCost: { gold: 3, food: 2 },
    reconstructionCost: { wood: 4, stone: 3 },
    annualBenefit: {},
    maritimeContractCost: { gold: 3 },
    annualContractTax: {},
    monopolyResource: null,
    monopolyOwner: null
  },
  K5: {
    id: "puerto-sur",
    tileId: "K5",
    name: "Puerto del Sur",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puerto",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/puerto-del-sur-bg.png",
    acquisitionCost: { gold: 3, food: 2 },
    reconstructionCost: { wood: 4, stone: 3 },
    annualBenefit: {},
    maritimeContractCost: { gold: 3 },
    annualContractTax: {},
    monopolyResource: null,
    monopolyOwner: null
  }
,
  D6: {
    id: "asentamiento-comercial-d6",
    tileId: "D6",
    name: "Puesto Comercial del Camino",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puesto Comercial",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/asentamiento-comercial-d6-bg.png",
    acquisitionCost: { gold: 2, food: 2 },
    reconstructionCost: { wood: 3, stone: 2 },
    annualBenefit: {},
    annualContractTax: {},
    tradeCardCost: { gold: 4, food: 1 },
    tradeCardAvailable: true,
    tollType: "Peaje de Caminos"
  },
  F5: {
    id: "asentamiento-comercial-f5",
    tileId: "F5",
    name: "Mercado Central",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puesto Comercial",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/asentamiento-comercial-f5-bg.png",
    acquisitionCost: { gold: 2, food: 2 },
    reconstructionCost: { wood: 3, stone: 2 },
    annualBenefit: {},
    annualContractTax: {},
    tradeCardCost: { gold: 4, food: 1 },
    tradeCardAvailable: true,
    tollType: "Peaje de Caminos"
  },
  H3: {
    id: "asentamiento-comercial-h3",
    tileId: "H3",
    name: "Puesto Comercial del Sur",
    category: "economico",
    categoryLabel: "Edificio Comercial · Puesto Comercial",
    owner: "neutral",
    influenceRadius: 2,
    background: "assets/cards/asentamiento-comercial-h3-bg.png",
    acquisitionCost: { gold: 2, food: 2 },
    reconstructionCost: { wood: 3, stone: 2 },
    annualBenefit: {},
    annualContractTax: {},
    tradeCardCost: { gold: 4, food: 1 },
    tradeCardAvailable: true,
    tollType: "Peaje de Caminos"
  }
,
  A5: {
    id: "puesto-exploracion-norte",
    tileId: "A5",
    name: "Puesto de Exploración Norte",
    category: "militar",
    categoryLabel: "Edificio Estratégico · Exploración",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/puesto-exploracion-a5-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 2, stone: 2 },
    annualBenefit: {},
    baseResources: {},
    metalChance: 0.32,
    tacticCardChance: 0.16,
    controlMethod: "presencia militar"
  },
  F1: {
    id: "puesto-exploracion-oeste",
    tileId: "F1",
    name: "Puesto de Exploración Oeste",
    category: "militar",
    categoryLabel: "Edificio Estratégico · Exploración",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/puesto-exploracion-f1-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 2, stone: 2 },
    annualBenefit: {},
    baseResources: {},
    metalChance: 0.32,
    tacticCardChance: 0.16,
    controlMethod: "presencia militar"
  },
  K1: {
    id: "puesto-exploracion-sur",
    tileId: "K1",
    name: "Puesto de Exploración Sur",
    category: "militar",
    categoryLabel: "Edificio Estratégico · Exploración",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/puesto-exploracion-k1-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 2, stone: 2 },
    annualBenefit: {},
    baseResources: {},
    metalChance: 0.32,
    tacticCardChance: 0.16,
    controlMethod: "presencia militar"
  }

,
  D3: {
    id: "templo-d3",
    tileId: "D3",
    name: "Santuario del Norte",
    category: "sagrado",
    categoryLabel: "Edificio Religioso · Santuario",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/templo-d3-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 3, stone: 4 },
    annualBenefit: {},
    annualContractTax: {},
    consecrationRequirements: {
      urbanSettlements: 2,
      commercialOrPort: 1,
      adjacentSquad: true,
      noEnemyDispute: true
    },
    unlocksUnit: {
      id: "monje-con-yari",
      name: "Monje con Yari",
      category: "Religioso / Militar"
    },
    templeRelief: {
      debtReduction: 1,
      taxRelief: 1
    }
  },
  F6: {
    id: "templo-f6",
    tileId: "F6",
    name: "Templo Central",
    category: "sagrado",
    categoryLabel: "Edificio Religioso · Templo",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/templo-f6-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 3, stone: 4 },
    annualBenefit: {},
    annualContractTax: {},
    consecrationRequirements: {
      urbanSettlements: 2,
      commercialOrPort: 1,
      adjacentSquad: true,
      noEnemyDispute: true
    },
    unlocksUnit: {
      id: "monje-con-yari",
      name: "Monje con Yari",
      category: "Religioso / Militar"
    },
    templeRelief: {
      debtReduction: 1,
      taxRelief: 1
    }
  },
  H6: {
    id: "templo-h6",
    tileId: "H6",
    name: "Santuario del Sur",
    category: "sagrado",
    categoryLabel: "Edificio Religioso · Santuario",
    owner: "neutral",
    influenceRadius: 1,
    background: "assets/cards/templo-h6-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 3, stone: 4 },
    annualBenefit: {},
    annualContractTax: {},
    consecrationRequirements: {
      urbanSettlements: 2,
      commercialOrPort: 1,
      adjacentSquad: true,
      noEnemyDispute: true
    },
    unlocksUnit: {
      id: "monje-con-yari",
      name: "Monje con Yari",
      category: "Religioso / Militar"
    },
    templeRelief: {
      debtReduction: 1,
      taxRelief: 1
    }
  }


};


const playerState = {
  blue: {
    name: "Jugador Azul",
    resources: { wood: 2, stone: 2, gold: 2, food: 2, metal: 0 },
    buildings: { urban: 0, house: 0, market: 0, extraction: 0, militaryComplex: 0, militaryCamp: 0, port: 0, settlement: 0, temple: 0, exploration: 0 },
    units: { villager: 0, archer: 0, samurai: 0, yariMonk: 0, cavalry: 0, monk: 0, diplomat: 0, ninja: 0, geisha: 0 },
    maxVillagers: 3,
    debt: 0,
    debtLedger: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 },
    debtAge: 0,
    marketRateBonus: 0,
    marketNetwork: null,
    initialTradeProtection: null,
    resourceConvoys: [],
    owner: "blue",
    pending: { buildings: {}, units: {} }, cards: { trade: 0, tactic: 0 }, cardInventory: { trade: [], tactic: [] }
  },
  red: {
    name: "Jugador Rojo",
    resources: { wood: 2, stone: 2, gold: 2, food: 2, metal: 0 },
    buildings: { urban: 0, house: 0, market: 0, extraction: 0, militaryComplex: 0, militaryCamp: 0, port: 0, settlement: 0, temple: 0, exploration: 0 },
    units: { villager: 0, archer: 0, samurai: 0, yariMonk: 0, cavalry: 0, monk: 0, diplomat: 0, ninja: 0, geisha: 0 },
    maxVillagers: 3,
    debt: 0,
    debtLedger: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 },
    debtAge: 0,
    marketRateBonus: 0,
    marketNetwork: null,
    initialTradeProtection: null,
    resourceConvoys: [],
    owner: "red",
    pending: { buildings: {}, units: {} }, cards: { trade: 0, tactic: 0 }, cardInventory: { trade: [], tactic: [] }
  }
};

const hudIcons = {
  urban: "assets/buildings/urban-blue.png",
  house: "assets/buildings/house-blue.png",
  market: "assets/buildings/market-blue.png",
  extraction: "assets/buildings/extraction-blue.png",
  militaryComplex: "assets/buildings/military-complex-blue.png",
  militaryCamp: "assets/buildings/military-camp-blue.png",
  port: "assets/buildings/port-blue.png",
  settlement: "assets/buildings/settlement-blue.png",
  temple: "assets/buildings/church-blue.png",
  exploration: "assets/buildings/exploration-blue.png",
  villager: "assets/units/villager-blue.png",
  samurai: "assets/categories/militar.png",
  cavalry: "assets/categories/militar.png",
  monk: "assets/categories/sagrado.png",
  diplomat: "assets/units/daimyo-blue.png",
  ninja: "assets/categories/militar.png",
  geisha: "assets/categories/diplomatico.png"
};

const playerBuildingCards = {};
let activeHudPlayer = "blue";
let setupState = {
  active: true,
  rolled: false,
  firstChooser: null,
  secondChooser: null,
  placingPlayer: null,
  firstSettlementTile: null,
  phase: "roll",
  firstVillagerTile: null,
  secondVillagerTile: null,
  urbanPlaced: { blue: false, red: false },
  villagerPlaced: { blue: false, red: false },
  daimyoPlaced: { blue: false, red: false }
};

let prospectiveSparseUrbanHintTileId = null;
let currentPlayer = "blue";
let currentYear = 1;
let currentSeasonIndex = 0;
const seasons = ["Primavera", "Verano", "Otoño", "Invierno"]
const resourceTypes = ["wood", "stone", "gold", "food", "metal"];

function villagerAsset(player) {
  return `assets/units/villager-${player}.png`;
}

function daimyoAsset(player) {
  return `assets/units/daimyo-${player}.png`;
}

const inventoryTypeMeta = {
  trade: { label: 'Cartas de Comercio', icon: 'assets/categories/comercio.png' },
  tactic: { label: 'Cartas de Batalla', icon: 'assets/categories/tactica.png' }
};

function seasonKey() {
  return `${currentYear}-${currentSeasonIndex}`;
}
const seasonBoardAssets = {
  Primavera: 'assets/board/map-spring.png',
  Verano: 'assets/board/map-summer.png',
  Otoño: 'assets/board/map-autumn.png',
  Invierno: 'assets/board/map-winter.png'
};

function emptyResourceCounts() {
  return { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 };
}

function cloneResourceCounts(values = {}) {
  const next = emptyResourceCounts();
  resourceTypes.forEach(type => {
    next[type] = Number(values[type] || 0);
  });
  return next;
}

function resourceMapTotal(values = {}) {
  return resourceTypes.reduce((sum, type) => sum + Math.max(0, Number(values[type] || 0)), 0);
}

function hasResourceEntries(values = {}) {
  return resourceMapTotal(values) > 0;
}

function normalizeDebtState(player) {
  const state = playerState[player];
  if (!state) return null;
  state.debtLedger = cloneResourceCounts(state.debtLedger || {});
  state.debtAge = Number(state.debtAge || 0);
  state.debt = resourceMapTotal(state.debtLedger);
  return state;
}

function clearDebtState(player) {
  const state = normalizeDebtState(player);
  if (!state) return;
  state.debtLedger = emptyResourceCounts();
  state.debtAge = 0;
  state.debt = 0;
}

function setDebtState(player, debtMap, age = 1) {
  const state = normalizeDebtState(player);
  if (!state) return;
  state.debtLedger = cloneResourceCounts(debtMap || {});
  state.debtAge = hasResourceEntries(state.debtLedger) ? age : 0;
  state.debt = resourceMapTotal(state.debtLedger);
}

function combinedDebtAndTaxes(player, taxes = {}) {
  const state = normalizeDebtState(player);
  const total = cloneResourceCounts(taxes || {});
  resourceTypes.forEach(type => {
    total[type] += Number(state?.debtLedger?.[type] || 0);
  });
  return total;
}

const diceSetA = [
  { value: 1, color: 'verde', src: 'assets/dice/1-verde.png' },
  { value: 2, color: 'rojo', src: 'assets/dice/2-rojo.png' },
  { value: 3, color: 'azul', src: 'assets/dice/3-azul.png' },
  { value: 4, color: 'amarillo', src: 'assets/dice/4-amarillo.png' },
  { value: 5, color: 'morado', src: 'assets/dice/5-morado.png' },
  { value: 6, color: 'naranja', src: 'assets/dice/6-naranja.png' }
];
const diceSetB = [
  { value: 1, color: 'naranja', src: 'assets/dice/1-naranja.png' },
  { value: 2, color: 'verde', src: 'assets/dice/2-verde.png' },
  { value: 3, color: 'rojo', src: 'assets/dice/3-rojo.png' },
  { value: 4, color: 'azul', src: 'assets/dice/4-azul.png' },
  { value: 5, color: 'amarillo', src: 'assets/dice/5-amarillo.png' },
  { value: 6, color: 'morado', src: 'assets/dice/6-morado.png' }
];

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function initializeVertices() {
  vertices.forEach((point, index) => {
    point.id = point.id || `P${index}`;
    point.neighbors = [];
  });
  vertices.forEach((point, index) => {
    vertices.forEach((other, otherIndex) => {
      if (index === otherIndex) return;
      const distance = pointDistance(point, other);
      const sharedCell = point.linkedCells.some(cellId => other.linkedCells.includes(cellId));
      if (distance <= 66 && sharedCell) point.neighbors.push(other.id);
    });
    point.neighbors = Array.from(new Set(point.neighbors));
  });
}

function getPointById(pointId) {
  return vertices.find(point => point.id === pointId) || null;
}

function pointsForCell(tileId) {
  return vertices.filter(point => point.linkedCells.includes(tileId));
}

function getReachablePoints(startPointId, speed = 2) {
  const visited = new Set([startPointId]);
  const frontier = [{ id: startPointId, depth: 0 }];
  const result = new Set();
  while (frontier.length) {
    const current = frontier.shift();
    if (current.depth >= speed) continue;
    const point = getPointById(current.id);
    (point?.neighbors || []).forEach(nextId => {
      if (visited.has(nextId)) return;
      visited.add(nextId);
      result.add(nextId);
      frontier.push({ id: nextId, depth: current.depth + 1 });
    });
  }
  return Array.from(result);
}

function cardIconForInventory(type) {
  return inventoryTypeMeta[type]?.icon || inventoryTypeMeta.trade.icon;
}

function ensureCardInventory(player, type) {
  const state = playerState[player];
  state.cardInventory = state.cardInventory || { trade: [], tactic: [] };
  state.cardInventory[type] = state.cardInventory[type] || [];
  return state.cardInventory[type];
}

function createCardInstance(type, player) {
  const samples = {
    trade: [
      { title: 'Contrato de Ruta', subtitle: 'Carta de Comercio', text: 'Recibe +2 Oro inmediatamente. Luego descarta esta carta.', effect: { gold: 2 } },
      { title: 'Trueque Ventajoso', subtitle: 'Carta de Comercio', text: 'Recibe +1 Madera y +1 Comida.', effect: { wood: 1, food: 1 } }
    ],
    tactic: [
      { title: 'Maniobra Rápida', subtitle: 'Carta de Batalla', text: 'El Daimio puede hacer un movimiento adicional este turno.', extraMove: true },
      { title: 'Orden de Repliegue', subtitle: 'Carta de Batalla', text: 'Roba 1 Carta de Comercio.', draw: { trade: 1 } }
    ]
  };
  const base = samples[type][Math.floor(Math.random() * samples[type].length)];
  return {
    id: `${type}-${player}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    player,
    title: base.title,
    subtitle: base.subtitle,
    text: base.text,
    effect: base.effect || null,
    draw: base.draw || null,
    extraMove: !!base.extraMove,
    background: type === 'trade' ? (Math.random() < 0.5 ? 'assets/cards/comercio-buenas-cosechas-bg.png' : 'assets/cards/comercio-rutas-caravanas-bg.png') : 'assets/cards/daimyo-bg.png',
    icon: cardIconForInventory(type)
  };
}

function getPlayerCards(player, type) {
  return ensureCardInventory(player, type);
}

let placementMode = null;
let placementConfirm = null;
let currentTrade = null;
let turnSerial = 0;
let actionCardHideTimer = null;
const placedUnits = {};
const builtSpecialTiles = new Set();
let activationQueue = [];
let setupPrimaryAction = null;
let currentDebtResolution = null;
let debtResolutionResolver = null;
let frontModalMode = null;
let annualBenefitSummaryResolver = null;
let lastAnnualBenefitResults = null;
let initialTradeProtectionResolver = null;

let selectedId = null;
let selectedPointId = null;
let movementMode = null;
let marketNetworkMode = null;
const pointUnits = {};
let resourceAssignments = {};
let neighborMap = {};

function isPortCard(card) {
  return card && card.categoryLabel.includes('Puerto');
}

function isCommercialSettlementCard(card) {
  return card && card.categoryLabel.includes('Puesto Comercial');
}

function isExplorationPostCard(card) {
  return card && card.categoryLabel.includes('Exploración');
}

function isTempleCard(card) {
  return card && (card.category === 'sagrado' || card.categoryLabel.includes('Templo') || card.categoryLabel.includes('Santuario'));
}

function isUrbanSettlementCard(card) {
  return card && card.category === 'civil' && card.buildingKind === 'urban';
}

function isPlayerBuiltCard(card) {
  return card && card.isPlayerBuilt;
}

function isCommercialCard(card) {
  return isPortCard(card) || isCommercialSettlementCard(card);
}

function isOuterCell(cell) {
  const rowMax = Math.max(...cells.map(c => c.row));
  const rowCells = cells.filter(c => c.row === cell.row);
  const maxCol = Math.max(...rowCells.map(c => c.col));
  return cell.row === 1 || cell.row === rowMax || cell.col === 1 || cell.col === maxCol;
}

function getCellById(id) {
  return cells.find(c => c.id === id);
}

function resourceIcon(type, alt = "") {
  return `<img src="${resourceAssets[type]}" class="hud-mini-icon" alt="${alt || resourceNames[type]}" />`;
}

function createSvgElement(tag) { return document.createElementNS("http://www.w3.org/2000/svg", tag); }
function pointsToString(points) { return points.map(([x,y]) => `${x},${y}`).join(" "); }
function splitLabel(name) { const words = name.split(" "); if (words.length <= 2) return [words.slice(0,-1).join(" ") || words[0], words.length > 1 ? words[words.length - 1] : ""]; const mid = Math.ceil(words.length / 2); return [words.slice(0,mid).join(" "), words.slice(mid).join(" ")]; }
function shuffle(arr) { const copy = [...arr]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
function dist(a,b) { const dx = a.cx - b.cx; const dy = a.cy - b.cy; return Math.sqrt(dx*dx + dy*dy); }

function buildNeighborMap() {
  const map = {};
  const threshold = 111.5;
  cells.forEach(cell => map[cell.id] = []);
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      const d = dist(cells[i], cells[j]);
      if (d <= threshold) {
        map[cells[i].id].push(cells[j].id);
        map[cells[j].id].push(cells[i].id);
      }
    }
  }
  neighborMap = map;
}

function resourcePool() {
  const pool = [];
  Object.entries(RESOURCE_COUNTS).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) pool.push(type);
  });
  return shuffle(pool);
}

function scoreSelection(chosen) {
  let minD = Infinity;
  let sumD = 0;
  for (let i = 0; i < chosen.length; i++) {
    for (let j = i + 1; j < chosen.length; j++) {
      const d = dist(chosen[i], chosen[j]);
      if (d < minD) minD = d;
      sumD += d;
    }
  }
  return minD * 1000 + sumD;
}

function randomIndependentSet(candidates) {
  const order = shuffle(candidates);
  const chosen = [];
  const blocked = new Set();
  for (const cell of order) {
    if (blocked.has(cell.id)) continue;
    chosen.push(cell);
    blocked.add(cell.id);
    (neighborMap[cell.id] || []).forEach(id => blocked.add(id));
  }
  return chosen;
}

function spreadScore(chosen) {
  let minD = Infinity;
  let sumD = 0;
  for (let i = 0; i < chosen.length; i++) {
    for (let j = i + 1; j < chosen.length; j++) {
      const d = dist(chosen[i], chosen[j]);
      if (d < minD) minD = d;
      sumD += d;
    }
  }
  return minD * 1000 + sumD;
}

function generateSpreadLocations() {
  const eligible = cells.filter(cell => !cell.special);
  const needed = Object.values(RESOURCE_COUNTS).reduce((a,b) => a + b, 0);

  let best = [];
  let bestScore = -Infinity;

  for (let trial = 0; trial < 4000; trial++) {
    const chosen = randomIndependentSet(eligible);
    if (chosen.length >= needed) {
      // Keep the best-spread valid solution.
      const current = chosen.slice(0, needed);
      const s = spreadScore(current);
      if (s > bestScore) {
        best = current;
        bestScore = s;
      }
    } else if (chosen.length > best.length) {
      best = chosen.slice();
    }
  }

  // Secondary improvement pass if we found at least the required amount.
  if (best.length >= needed) {
    return best.slice(0, needed);
  }

  // Fallback: greedy farthest-first from the best partial set.
  if (best.length > 0) {
    return best.slice(0, Math.min(best.length, needed));
  }

  return [];
}

function commercialDomainCellsForResources() {
  const commercialIds = Object.keys(buildingCards).filter(id => isCommercialCard(buildingCards[id]));
  const ids = new Set();
  commercialIds.forEach(id => {
    getCellsWithinRadius(id, 2).forEach(cellId => ids.add(cellId));
  });
  return cells.filter(cell => ids.has(cell.id) && !isOuterCell(cell) && !cell.special && !playerBuildingCards[cell.id]);
}

function assignResources() {
  const assignments = {};
  const pool = resourcePool();
  const eligible = commercialDomainCellsForResources();

  if (!eligible.length) {
    resourceAssignments = assignments;
    renderCounts();
    addLog('No hay casillas válidas dentro de dominios comerciales para recursos.', 'warn');
    return;
  }

  let best = [];
  let bestScore = -Infinity;
  const needed = Math.min(pool.length, eligible.length);

  for (let trial = 0; trial < 4000; trial++) {
    const chosen = randomIndependentSet(eligible);
    const current = chosen.length >= needed ? chosen.slice(0, needed) : chosen.slice();
    const score = spreadScore(current) + current.length * 1000;
    if (score > bestScore) {
      best = current;
      bestScore = score;
    }
  }

  if (best.length < needed) {
    const chosenIds = new Set(best.map(cell => cell.id));
    const remainder = shuffle(eligible.filter(cell => !chosenIds.has(cell.id)));
    best = best.concat(remainder).slice(0, needed);
  }

  const shuffledPool = shuffle(pool);
  best.slice(0, needed).forEach((cell, index) => {
    assignments[cell.id] = shuffledPool[index];
  });

  resourceAssignments = Object.fromEntries(Object.entries(assignments).filter(([tileId]) => eligible.some(cell => cell.id === tileId)));
  renderCounts();
  addLog(`Recursos generados solo dentro de dominios comerciales: ${Object.keys(resourceAssignments).length}/${pool.length}.`, 'gold');
}

function renderCounts() {
  const total = Object.values(RESOURCE_COUNTS).reduce((a,b) => a + b, 0);
  resourceCountsBox.innerHTML = `<strong>Madera:</strong> ${RESOURCE_COUNTS.wood}<br><strong>Piedra:</strong> ${RESOURCE_COUNTS.stone}<br><strong>Oro:</strong> ${RESOURCE_COUNTS.gold}<br><strong>Comida:</strong> ${RESOURCE_COUNTS.food}<br><strong>Metales:</strong> ${RESOURCE_COUNTS.metal}<br><strong>Total:</strong> ${total}`;
}



function assignMaritimeMonopolies() {
  const portIds = Object.keys(buildingCards).filter(id => isPortCard(buildingCards[id]));
  const shuffledResources = shuffle(MARITIME_MONOPOLY_RESOURCES);
  maritimeContracts = {};
  portIds.forEach((tileId, index) => {
    const card = buildingCards[tileId];
    card.monopolyResource = shuffledResources[index % shuffledResources.length];
    card.monopolyOwner = null;
  card.monopolyPending = 0;
    maritimeContracts[tileId] = {
      resource: card.monopolyResource,
      owner: null,
      cost: { gold: 3 },
      ownerExchangeRate: 'mejorada',
      rivalExchangeRate: 'encarecida'
    };
  });
}

function monopolyResourceLabel(card) {
  const type = card.monopolyResource || 'gold';
  return `<span class="inline-resource monopoly-resource"><img src="${resourceAssets[type]}" alt="${resourceNames[type]}" />${resourceNames[type]}</span>`;
}

function monopolyOwnerLabel(card) {
  if (!card.monopolyOwner) return 'Disponible';
  return card.monopolyOwner === 'blue' ? 'Contratado por Jugador Azul' : 'Contratado por Jugador Rojo';
}

function contractMaritime(tileId, owner = currentPlayer) {
  const card = buildingCards[tileId];
  if (!card || !isPortCard(card)) return;
  if (!isCardOperational(card)) {
    addLog('Este Puerto todavía no está operativo para contratar Conexión Marítima.', 'warn');
    return;
  }
  if (card.owner !== owner) {
    addLog(`${playerState[owner]?.name || 'El jugador'} no puede contratar esta Conexión Marítima: primero debe controlar/adquirir el Puerto con el Daimio.`, 'warn');
    return;
  }
  if (card.monopolyOwner) {
    addLog('Esta conexión marítima ya está contratada.', 'warn');
    return;
  }
  if (!canCurrentPlayerActAs(owner)) {
    addLog(turnLockedMessage(owner), 'warn');
    return;
  }
  const cost = card.maritimeContractCost || { gold: 3 };
  if (!canAfford(owner, cost)) {
    addLog(`${playerState[owner].name} no puede contratar la conexión marítima: necesita ${resourceCostHtml(cost).replace(/<[^>]+>/g, ' ').trim() || 'más recursos'}.`, 'warn');
    return;
  }
  payCost(owner, cost);
  card.monopolyOwner = owner;
  if (maritimeContracts[tileId]) maritimeContracts[tileId].owner = owner;
  renderHud();
  renderBuildingCard(tileId);
  showInfluence(tileId, card.influenceRadius, card.owner);
  addLog(`${playerState[owner].name} contrata la Conexión Marítima de ${card.name}.`, owner);
}

function resetMaritimeContract(tileId) {
  const card = buildingCards[tileId];
  if (!card) return;
  card.monopolyOwner = null;
  card.monopolyPending = 0;
  if (maritimeContracts[tileId]) maritimeContracts[tileId].owner = null;
  renderBuildingCard(tileId);
}

function categoryIcon(card) {
  const src = categoryAssets[card.category] || categoryAssets.civil;
  return `<img src="${src}" alt="${card.categoryLabel}" />`;
}

function ownerClass(owner) {
  if (owner === 'blue') return 'owner-blue';
  if (owner === 'red') return 'owner-red';
  return 'owner-neutral';
}

function ownerLabel(owner) {
  if (owner === 'blue') return 'Jugador Azul';
  if (owner === 'red') return 'Jugador Rojo';
  return 'Neutral';
}

function canCurrentPlayerActAs(player) {
  if (!player || player === 'neutral') return false;
  if (setupState.active) {
    return player === setupState.placingPlayer || player === placementMode?.player;
  }
  return player === currentPlayer;
}

function turnLockedMessage(player) {
  return `No puedes manipular a ${ownerLabel(player)} ahora. Turno actual: ${ownerLabel(currentPlayer)}.`;
}

function resourcePips(type, count) {
  const icons = Array.from({ length: count }, () => `<img class="resource-icon" src="${resourceAssets[type]}" alt="${resourceNames[type]}" />`).join('');
  return `<span class="resource-group"><span class="resource-icons">${icons}</span><span class="resource-label ${type === 'gold' ? 'gold-text' : ''}">${count} ${resourceNames[type]}</span></span>`;
}

function inlineResource(type, count) {
  return `<span class="inline-resource"><img src="${resourceAssets[type]}" alt="${resourceNames[type]}" />+${count} ${resourceNames[type]}</span>`;
}

function inlineResourceDelta(type, count) {
  const sign = count > 0 ? '+' : '';
  const cls = count < 0 ? ' negative-resource' : '';
  return `<span class="inline-resource${cls}"><img src="${resourceAssets[type]}" alt="${resourceNames[type]}" />${sign}${count} ${resourceNames[type]}</span>`;
}

function annualBenefitHtml(card) {
  const entries = Object.entries(card.annualBenefit || {});
  if (!entries.length) return `<span class="inline-resource">Sin beneficio asignado</span>`;

  return `<span class="annual-benefit-wrap">` + entries.map(([type, count]) => {
    const activeBonus = card.monopolyOwner && card.monopolyResource === type;
    const modifier = activeBonus ? `<span class="modifier-note">(+1 por monopolio de ${resourceNames[type]})</span>` : '';
    return `<span class="annual-resource-pack">${inlineResource(type, count)} ${modifier}</span>`;
  }).join(' ') + `</span>`;
}

function generateAnnualBenefit() {
  const available = shuffle(['wood', 'stone', 'gold', 'food', 'metal']);
  const first = available[0];
  const second = available[1];
  const benefit = {};
  benefit[first] = first === 'metal' ? 1 : 2;
  benefit[second] = second === 'metal' ? 1 : 1;
  return benefit;
}

function generateAnnualContractTax() {
  const available = shuffle(['wood', 'stone', 'gold', 'food', 'metal']);
  const first = available[0];
  const second = available[1];
  const tax = {};
  tax[first] = 1;
  tax[second] = 1;
  return tax;
}

function generateExplorationBaseResources() {
  const pairs = [
    ['wood', 'gold'],
    ['stone', 'food'],
    ['wood', 'food'],
    ['stone', 'gold'],
    ['wood', 'stone'],
    ['gold', 'food']
  ];
  const chosen = shuffle(pairs)[0];
  return { [chosen[0]]: 1, [chosen[1]]: 1 };
}

function baseResourceHtml(resources) {
  const entries = Object.entries(resources || {});
  if (!entries.length) return `<span class="inline-resource">Sin recursos base asignados</span>`;
  return entries.map(([type, count]) => inlineResource(type, count)).join(' ');
}


function annualContractTaxHtml(card) {
  const entries = Object.entries(card.annualContractTax || {});
  if (!entries.length) return `<span class="inline-resource">Sin impuesto asignado</span>`;
  return entries.map(([type, count]) => {
    const icons = Array.from({ length: count }, () => `<img class="resource-icon" src="${resourceAssets[type]}" alt="${resourceNames[type]}" />`).join('');
    return `<span class="resource-group"><span class="resource-icons">${icons}</span><span class="resource-label">${count} ${resourceNames[type]}</span></span>`;
  }).join(' ');
}

function resourceCostHtml(cost) {
  return Object.entries(cost || {}).map(([type, count]) => resourcePips(type, count)).join(' ');
}


function debtResourceHtml(resources) {
  const entries = Object.entries(resources || {}).filter(([, count]) => count > 0);
  if (!entries.length) return `<span class="inline-resource">Sin deuda pendiente</span>`;
  return entries.map(([type, count]) => resourcePips(type, count)).join(' ');
}

function debtPayRow(type, available, selected = 0) {
  return `<div class="trade-give-row debt-pay-row">
    <span><img src="${resourceAssets[type]}" alt="${resourceNames[type]}"/> ${resourceNames[type]} <small>tienes ${available}</small></span>
    <div class="trade-stepper">
      <button onclick="changeDebtPayment('${type}', -1)">−</button>
      <strong id="debtPay-${type}">${selected}</strong>
      <button onclick="changeDebtPayment('${type}', 1)">+</button>
    </div>
  </div>`;
}


function debtSourceRow(label, resources) {
  if (!hasResourceEntries(resources)) return '';
  return `<div class="debt-source-row"><span>${label}</span><strong>${debtResourceHtml(resources)}</strong></div>`;
}

function debtSourcesHtml(sources = []) {
  const rows = sources.filter(item => hasResourceEntries(item.cost || item.resources || {}));
  if (!rows.length) return `<p class="mini-note">No hay fuentes específicas de deuda/impuesto este año.</p>`;
  return rows.map(item => debtSourceRow(item.label, item.cost || item.resources)).join('');
}

function subtractDebtByValue(dueMap, amount) {
  const remaining = cloneResourceCounts(dueMap || {});
  let left = Math.max(0, amount || 0);
  const order = shuffle(resourceTypes.filter(type => remaining[type] > 0));
  while (left > 0 && resourceMapTotal(remaining) > 0) {
    for (const type of order) {
      if (left <= 0) break;
      if (remaining[type] > 0) {
        remaining[type] -= 1;
        left -= 1;
      }
    }
  }
  return remaining;
}




function assignPortAnnualBenefits() {
  Object.values(buildingCards).forEach(card => {
    if (isPortCard(card)) {
      card.annualBenefit = generateAnnualBenefit();
      card.annualContractTax = generateAnnualContractTax();
    }

    if (isCommercialSettlementCard(card)) {
      card.annualBenefit = generateAnnualBenefit();
      card.annualContractTax = generateAnnualContractTax();
    }

    if (isExplorationPostCard(card)) {
      card.baseResources = generateExplorationBaseResources();
      card.annualBenefit = card.baseResources;
      card.annualContractTax = {};
    }
  });
}

function getCellsWithinRadius(originId, radius) {
  const visited = new Set([originId]);
  let frontier = [originId];
  for (let step = 0; step < radius; step++) {
    const next = [];
    frontier.forEach(id => {
      (neighborMap[id] || []).forEach(neighborId => {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          next.push(neighborId);
        }
      });
    });
    frontier = next;
  }
  return [...visited];
}

function getCellsAtDistance(originId, distance) {
  if (distance <= 0) return [originId];
  const outer = new Set(getCellsWithinRadius(originId, distance));
  getCellsWithinRadius(originId, distance - 1).forEach(id => outer.delete(id));
  return [...outer];
}

function isInAnyOwnedUrbanRadius(player, tileId, radius = 1) {
  return Object.values(playerBuildingCards).some(card =>
    isUrbanSettlementCard(card) && card.owner === player && getCellsWithinRadius(card.tileId, radius).includes(tileId)
  );
}

function isInEnemyUrbanRadius(player, tileId, radius = 1) {
  return Object.values(playerBuildingCards).some(card =>
    isUrbanSettlementCard(card) && card.owner && card.owner !== player && getCellsWithinRadius(card.tileId, radius).includes(tileId)
  );
}

function countNeutralDominions(player) {
  return Object.values(buildingCards).filter(card =>
    card && card.owner === player && (isPortCard(card) || isCommercialSettlementCard(card) || isTempleCard(card) || isExplorationPostCard(card))
  ).length;
}

function isInOwnedUrbanExtractionRange(player, tileId) {
  return Object.values(playerBuildingCards).some(card => {
    if (!isUrbanSettlementCard(card) || card.owner !== player) return false;
    const far = new Set(getCellsWithinRadius(card.tileId, 3));
    getCellsWithinRadius(card.tileId, 1).forEach(id => far.delete(id));
    return far.has(tileId);
  });
}

function extractionDelayForTile(player, tileId) {
  let best = 2;
  Object.values(playerBuildingCards).forEach(card => {
    if (!isUrbanSettlementCard(card) || card.owner !== player) return;
    if (getCellsAtDistance(card.tileId, 2).includes(tileId)) best = Math.min(best, 1);
    if (getCellsAtDistance(card.tileId, 3).includes(tileId)) best = Math.min(best, 2);
  });
  return best;
}

function updateUrbanCreationOptions(player) {
  Object.values(playerBuildingCards).forEach(card => {
    if (isUrbanSettlementCard(card) && card.owner === player) card.creationOptions = urbanCreationOptionsFor(player);
  });
}

function unitTokenAsset(type, player) {
  const map = {
    archer: `assets/units/archer-${player}.png`,
    samurai: `assets/units/samurai-${player}.png`,
    yariMonk: `assets/units/yari-monk-${player}.png`
  };
  return map[type] || `assets/units/archer-${player}.png`;
}

function militaryUnitInfo(type) {
  const data = {
    archer: { name: 'Arquero Yumi', subtitle: 'Infantería ligera a distancia · Anti infantería pesada', legion: 100, role: 'Ataque a distancia. Bueno contra infantería pesada.', art: 'assets/cards/archer-unit-bg.png' },
    samurai: { name: 'Samurai', subtitle: 'Infantería pesada · Anti caballería e infantería pesada', legion: 300, role: 'Unidad pesada de choque. Buena contra caballería e infantería pesada.', art: 'assets/cards/samurai-unit-bg.png' },
    yariMonk: { name: 'Monje con Yari', subtitle: 'Monje guerrero · Infantería ligera anti caballería', legion: 50, role: 'Unidad religiosa de lanza. Se desbloqueará por Templo/Monasterio, no por complejo militar.', art: 'assets/cards/yari-monk-unit-bg.png' }
  };
  return data[type] || data.archer;
}

function militaryUnitBuildData(type) {
  const data = {
    archer: { label: 'Arquero Yumi', cost: { wood: 1, food: 1 }, turns: 1, speed: 1, legion: 100, canCreate: true },
    samurai: { label: 'Samurai', cost: { food: 2, metal: 1 }, turns: 1, speed: 1, legion: 300, canCreate: true },
    yariMonk: { label: 'Monje con Yari', cost: { food: 1, metal: 1 }, turns: 1, speed: 1, legion: 50, canCreate: false }
  };
  return data[type] || data.archer;
}

function hasActiveMilitaryComplex(player) {
  return (playerState[player]?.buildings?.militaryComplex || 0) >= 1;
}

function hasActiveMilitaryCamp(player) {
  return (playerState[player]?.buildings?.militaryCamp || 0) >= 1;
}

function militaryUnitCreationBlockReason(card, unitType = 'unidad') {
  if (!card) return 'No hay edificio militar seleccionado.';
  const player = card.owner || currentPlayer;
  if (card.buildingKind !== 'militaryComplex') return 'Las tropas se crean desde el Complejo Militar. El Campamento Militar solo habilita capacidad y alojamiento.';
  if (!isCardOperational(card)) return 'Este Complejo Militar todavía está en preparación.';
  if (!hasActiveMilitaryCamp(player)) return 'Necesitas construir y activar primero un Campamento Militar para poder crear tropas.';
  const build = militaryUnitBuildData(unitType);
  if (build && build.canCreate === false) return 'Esta unidad todavía no se crea por edificios militares.';
  if (!canAfford(player, build?.cost || {})) return `Recursos insuficientes para crear ${build?.label || 'esta unidad'}.`;
  return '';
}

function militaryCreationOptionsForBuilding(card) {
  if (!card || card.buildingKind !== 'militaryComplex') return [];
  return ['archer','samurai'].map(type => {
    const info = militaryUnitInfo(type);
    const build = militaryUnitBuildData(type);
    const lockedReason = militaryUnitCreationBlockReason(card, type);
    return { id: type, name: info.name, icon: unitTokenAsset(type, card.owner || currentPlayer), cost: build.cost, effect: `${info.subtitle}. Legión básica: ${build.legion}.`, turns: build.turns, lockedReason };
  });
}

function renderMilitaryCreationOption(option, owner, sourceTileId) {
  const disabled = option.lockedReason ? ' disabled' : '';
  const lockClass = option.lockedReason ? ' locked-creation-option' : '';
  const click = option.lockedReason ? `addLog('${String(option.lockedReason).replace(/'/g, "\'")}', 'warn')` : `beginMilitaryUnitPlacement('${sourceTileId}','${option.id}')`;
  const note = option.lockedReason ? option.lockedReason : `${resourceCostHtml(option.cost)} · ${option.effect}`;
  return `<button class="creation-option${lockClass}" onclick="${click}"${disabled}>
    <span class="creation-token-wrap"><img src="${option.icon}" alt="${option.name}" /></span>
    <span><strong>${option.name}</strong><small>${note}</small></span>
  </button>`;
}

function showResourceBubble(tileId, gains) {
  if (!resourceBubbleLayer || !gains || !Object.keys(gains).length) return;
  const cell = getCellById(tileId) || cells.find(c => c.id === tileId);
  if (!cell) return;
  const wrapper = resourceBubbleLayer.parentElement;
  const rect = wrapper.getBoundingClientRect();
  const x = (cell.cx / 1254) * rect.width;
  const y = (cell.cy / 1254) * rect.height;
  Object.entries(gains).forEach(([type, amount], index) => {
    if (!amount) return;
    const bubble = document.createElement('div');
    bubble.className = 'resource-bubble';
    bubble.style.left = `${x + (index * 18) - 20}px`;
    bubble.style.top = `${y - 30 - (index * 6)}px`;
    bubble.innerHTML = `<img src="${resourceAssets[type]}" alt=""/><span>+${amount}</span>`;
    resourceBubbleLayer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1400);
  });
}

function showTurnSweep(player, options = {}) {
  if (!turnSweepOverlay) return Promise.resolve();
  const isYear = options.type === 'year';
  if (!isYear && !playerState[player]) return Promise.resolve();
  const toneClass = isYear ? 'turn-sweep-year' : `turn-sweep-${player}`;
  const text = options.text || (isYear ? 'Se ha acabado el año' : `Turno ${player === 'blue' ? 'Azul' : 'Rojo'}`);
  const duration = options.duration || 1750;

  turnSweepOverlay.className = `turn-sweep-overlay ${toneClass}`;
  turnSweepOverlay.setAttribute('aria-hidden', 'false');
  turnSweepOverlay.innerHTML = `
    <div class="turn-sweep-band"></div>
    <div class="turn-sweep-text">${text}</div>
  `;
  window.clearTimeout(showTurnSweep._timer);
  return new Promise(resolve => {
    showTurnSweep._timer = window.setTimeout(() => {
      if (!turnSweepOverlay) { resolve(); return; }
      turnSweepOverlay.className = 'turn-sweep-overlay hidden';
      turnSweepOverlay.setAttribute('aria-hidden', 'true');
      turnSweepOverlay.innerHTML = '';
      resolve();
    }, duration);
  });
}

function showYearEndSweep() {
  return showTurnSweep(null, { type: 'year', text: 'Se ha acabado el año', duration: 1800 });
}

function clearInfluence() {
  document.querySelectorAll('.hex-group').forEach(group => {
    group.classList.remove('influence-neutral', 'influence-blue', 'influence-red');
  });
}



function addLog(message, tone = "normal") {
  if (!gameLog) return;
  const line = document.createElement("div");
  line.className = `log-line ${tone}`;
  line.textContent = message;
  gameLog.appendChild(line);
  while (gameLog.children.length > 8) gameLog.removeChild(gameLog.firstChild);
  gameLog.scrollTop = gameLog.scrollHeight;
}

function resetLog() {
  if (!gameLog) return;
  gameLog.innerHTML = "";
}

function toggleDebugPanel() {
  debugPanel?.classList.toggle("debug-collapsed");
}

function setSetupMessage(message, tone = "normal") {
  const setupText = document.getElementById('setupText');
  if (setupText) setupText.textContent = message;
  addLog(message, tone);
}


function showSetupModal({ title = 'Inicio', text = '', buttonLabel = 'Continuar', action = null, showDice = false, rollLabel = '', rollResult = '', die1 = 1, die2 = 1, tone = 'normal' } = {}) {
  const panel = document.getElementById('setupPanel');
  const cardEl = panel ? panel.querySelector('.setup-card') : null;
  const titleEl = document.getElementById('setupTitle');
  const textEl = document.getElementById('setupText');
  const buttonEl = document.getElementById('rollSetupBtn');
  const diceBox = document.getElementById('setupDiceBox');
  const rollLabelEl = document.getElementById('setupRollLabel');
  const rollResultEl = document.getElementById('setupRollResult');
  const dieOne = document.getElementById('dieOne');
  const dieTwo = document.getElementById('dieTwo');
  if (panel) panel.style.display = '';
  if (cardEl) {
    cardEl.classList.remove('setup-tone-system', 'setup-tone-blue', 'setup-tone-red', 'setup-tone-neutral');
    const toneClass = tone === 'blue' ? 'setup-tone-blue' : tone === 'red' ? 'setup-tone-red' : tone === 'system' ? 'setup-tone-system' : 'setup-tone-neutral';
    cardEl.classList.add(toneClass);
  }
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  if (buttonEl) { buttonEl.textContent = buttonLabel; buttonEl.disabled = false; buttonEl.classList.remove('locked-button'); }
  if (diceBox) diceBox.classList.toggle('hidden', !showDice);
  if (rollLabelEl) rollLabelEl.textContent = rollLabel;
  if (rollResultEl) rollResultEl.textContent = rollResult;
  if (dieOne) { if (typeof die1 === 'object') setDieVisual(dieOne, die1); else { dieOne.style.backgroundImage = ''; dieOne.textContent = die1; } }
  if (dieTwo) { if (typeof die2 === 'object') setDieVisual(dieTwo, die2); else { dieTwo.style.backgroundImage = ''; dieTwo.textContent = die2; } }
  setupPrimaryAction = action;
  if (text) addLog(text, tone);
}

function hideSetupModal() {
  const panel = document.getElementById('setupPanel');
  if (panel) panel.style.display = 'none';
}

function handleSetupPrimaryAction() {
  if (typeof setupPrimaryAction === 'function') setupPrimaryAction();
}

function getPendingCount(player, collection, type) {
  const pending = playerState[player]?.pending?.[collection] || {};
  return pending[type] || 0;
}

function addPendingCount(player, collection, type, amount = 1) {
  const bucket = playerState[player].pending[collection] || (playerState[player].pending[collection] = {});
  bucket[type] = (bucket[type] || 0) + amount;
}

function removePendingCount(player, collection, type, amount = 1) {
  const bucket = playerState[player].pending[collection] || (playerState[player].pending[collection] = {});
  bucket[type] = Math.max(0, (bucket[type] || 0) - amount);
}

function isCardOperational(card) {
  return !card || !card.pendingSeasons || card.pendingSeasons <= 0;
}

function getActiveVillagersOnTile(tileId) {
  const unit = placedUnits[tileId];
  if (!unit || unit.type !== 'villager') return 0;
  // v1.0.5: los aldeanos ya no tienen espera de activación.
  return Math.max(0, unit.count || 0);
}

function registerActivation(item) {
  activationQueue.push(item);
}

function pendingDelayForPlacement(type) {
  if (type === 'house' || type === 'market' || type === 'extraction' || type === 'militaryComplex' || type === 'militaryCamp') return 1;
  if (type === 'urban') return 2;
  if (type === 'villager') return 0;
  return 0;
}


function processPendingUnitActivationsForTurn(player) {
  const remaining = [];
  activationQueue.forEach(item => {
    if (item.kind !== 'unitTurn') { remaining.push(item); return; }
    if (item.player !== player || item.createdTurnSerial >= turnSerial) { remaining.push(item); return; }

    removePendingCount(item.player, 'units', item.type, item.count || 1);
    playerState[item.player].units[item.type] = (playerState[item.player].units[item.type] || 0) + (item.count || 1);
    const unit = placedUnits[item.tileId];
    if (unit && unit.pendingActivations) {
      for (let i = 0; i < (item.count || 1); i++) unit.pendingActivations.shift();
    }
    addLog(`${playerState[item.player].name}: un Aldeano en ${item.tileId} ya está activo.`, item.player);
  });
  activationQueue = remaining;
  renderHud();
  drawBoard();
}

function processPendingActivationsOnSeasonChange() {
  if (!activationQueue.length) return;
  const remaining = [];
  activationQueue.forEach(item => {
    if (item.kind === 'unitTurn') { remaining.push(item); return; }
    item.remaining -= 1;
    if (item.kind === 'building' && playerBuildingCards[item.tileId]) {
      playerBuildingCards[item.tileId].pendingSeasons = Math.max(0, item.remaining);
    }
    if (item.kind === 'contract' && buildingCards[item.tileId]) {
      buildingCards[item.tileId].monopolyPending = Math.max(0, item.remaining);
    }

    if (item.remaining > 0) {
      remaining.push(item);
      return;
    }

    if (item.kind === 'unit') {
      removePendingCount(item.player, 'units', item.type, item.count || 1);
      playerState[item.player].units[item.type] = (playerState[item.player].units[item.type] || 0) + (item.count || 1);
      const unit = placedUnits[item.tileId];
      if (unit && unit.pendingActivations) {
        for (let i = 0; i < (item.count || 1); i++) {
          const idx = unit.pendingActivations.indexOf(0);
          if (idx >= 0) unit.pendingActivations.splice(idx, 1);
          else if (unit.pendingActivations.length) unit.pendingActivations.shift();
        }
      }
      addLog(`${playerState[item.player].name}: un Aldeano en ${item.tileId} ya está activo.`, item.player);
    }

    if (item.kind === 'building') {
      removePendingCount(item.player, 'buildings', item.type, 1);
      playerState[item.player].buildings[item.type] = (playerState[item.player].buildings[item.type] || 0) + 1;
      const card = playerBuildingCards[item.tileId];
      if (card) card.pendingSeasons = 0;
      if (item.type === 'house' || item.type === 'urban') refreshPlayerCaps(item.player);
      if (item.type === 'urban') updateUrbanCreationOptions(item.player);
      addLog(`${playerState[item.player].name}: ${item.label || 'Edificio'} en ${item.tileId} ya está activo.`, item.player);
    }

    if (item.kind === 'contract') {
      const card = buildingCards[item.tileId];
      if (card) card.monopolyPending = 0;
      addLog(`${playerState[item.player].name}: el contrato de ${buildingCards[item.tileId]?.name || item.tileId} ya está activo.`, item.player);
    }
  });
  activationQueue = remaining;
  renderHud();
  drawBoard();
}


function randomDiceFace(dieIndex = 1) {
  const set = dieIndex === 2 ? diceSetB : diceSetA;
  return set[Math.floor(Math.random() * set.length)];
}

function setDieVisual(element, face) {
  if (!element || !face) return;
  element.textContent = '';
  element.style.backgroundImage = `url('${face.src}')`;
  element.style.backgroundSize = 'cover';
  element.style.backgroundPosition = 'center';
}

function awardCard(player, type, amount = 1, reason = '') {
  const label = type === 'trade' ? 'Carta de Comercio' : 'Carta de Batalla';
  const bag = ensureCardInventory(player, type);
  for (let i = 0; i < amount; i++) bag.push(createCardInstance(type, player));
  playerState[player].cards[type] = bag.length;
  addLog(`${playerState[player].name} gana ${amount} ${label}${amount > 1 ? 's' : ''}${reason ? ` por ${reason}` : ''}.`, player);
  renderHud();
}

function analyzeDiceRoll(roll) {
  const values = [roll.face1.value, roll.face2.value];
  const colors = [roll.face1.color, roll.face2.color];
  const hasNumberPair = values[0] === values[1];
  const hasColorPair = colors[0] === colors[1];

  return {
    hasNumberPair,
    hasColorPair,
    givesBattleCard: hasNumberPair,
    givesTradeCard: hasColorPair,
    hasCardReward: hasNumberPair || hasColorPair
  };
}

function diceRewardSummary(roll) {
  const analysis = analyzeDiceRoll(roll);
  const parts = [];

  if (analysis.givesBattleCard) parts.push('par numérico: Carta de Batalla');
  if (analysis.givesTradeCard) parts.push('color repetido: Carta de Comercio');

  return parts.length ? parts.join(' · ') : 'sin carta especial';
}

function baseRollRecord(player, roll, analysis) {
  return { player, roll, analysis };
}

function shouldGrantCompensation(previousRecord, currentRecord) {
  if (!previousRecord || !currentRecord) return false;
  if (previousRecord.player === currentRecord.player) return false;
  return !previousRecord.analysis.hasCardReward && currentRecord.analysis.hasCardReward;
}

async function applyDiceRewards(player, roll, { source = 'tirada' } = {}) {
  const analysis = analyzeDiceRoll(roll);

  // Reglas separadas:
  // - Par numérico = Carta de Batalla.
  // - Color repetido = Carta de Comercio.
  // Ambas pueden ocurrir en la misma tirada si coinciden número y color.
  if (analysis.givesBattleCard) awardCard(player, 'tactic', 1, `${source}: par numérico`);
  if (analysis.givesTradeCard) awardCard(player, 'trade', 1, `${source}: color repetido`);

  return analysis;
}

async function maybeRunCompensationRoll(previousRecord, currentRecord) {
  if (!shouldGrantCompensation(previousRecord, currentRecord)) return null;
  return runCompensationRoll(previousRecord.player, currentRecord.player);
}

function runCompensationRoll(player, originalPlayer) {
  return new Promise(resolve => {
    showSetupModal({
      title: 'Tirada extra compensatoria',
      text: `${playerState[originalPlayer].name} obtuvo carta por par/color. ${playerState[player].name} recibe una sola tirada extra para intentar ganar carta.`,
      buttonLabel: `Lanzar tirada extra de ${ownerLabel(player)}`,
      action: async () => {
        const roll = await diceSequence(player, 'Tirada extra', 'Continuar');
        const analysis = await applyDiceRewards(player, roll, { source: 'tirada extra' });
        showSetupModal({
          title: 'Tirada extra completada',
          text: `Resultado: ${roll.total}. ${diceRewardSummary(roll)}. La tirada extra no genera otra tirada extra.`,
          buttonLabel: 'Continuar',
          action: () => { hideSetupModal(); resolve({ player, roll, analysis }); },
          showDice: true,
          rollLabel: ownerLabel(player),
          rollResult: `${roll.face1.value} + ${roll.face2.value} = ${roll.total} · ${diceRewardSummary(roll)}`,
          die1: roll.face1,
          die2: roll.face2
        });
      }
    });
  });
}

function runAnnualDiceFlow() {
  return new Promise(resolve => {
    showSetupModal({
      title: `Inicio del Año ${currentYear}`,
      text: 'Cada jugador lanzará dados para recompensas anuales.',
      buttonLabel: 'Lanzar dados anuales del Azul',
      action: async () => {
        const blue = await diceSequence('blue', 'Dados anuales', 'Lanzamiento anual del Rojo');
        const blueAnalysis = await applyDiceRewards('blue', blue, { source: `inicio del Año ${currentYear}` });
        const blueRecord = baseRollRecord('blue', blue, blueAnalysis);

        showSetupModal({
          title: 'Dados anuales del Rojo',
          text: 'Ahora lanza el Jugador Rojo.',
          buttonLabel: 'Lanzar dados anuales del Rojo',
          action: async () => {
            const red = await diceSequence('red', 'Dados anuales', 'Continuar');
            const redAnalysis = await applyDiceRewards('red', red, { source: `inicio del Año ${currentYear}` });
            const redRecord = baseRollRecord('red', red, redAnalysis);

            await maybeRunCompensationRoll(blueRecord, redRecord);

            showSetupModal({
              title: 'Dados anuales completados',
              text: 'Se continuará con impuestos y beneficios anuales.',
              buttonLabel: 'Continuar',
              action: () => { hideSetupModal(); resolve(); }
            });
          }
        });
      },
      tone: 'gold'
    });
  });
}

function diceSequence(player, contextLabel = 'Lanzamiento', continueLabel = 'Continuar') {
  return new Promise(resolve => {
    const playerLabel = player === 'blue' ? 'Jugador 1 · Azul' : 'Jugador 2 · Rojo';
    const tone = player === 'blue' ? 'blue' : 'red';
    const buttonEl = document.getElementById('rollSetupBtn');
    let face1 = randomDiceFace(1);
    let face2 = randomDiceFace(2);
    let resolved = false;

    if (buttonEl) buttonEl.disabled = true;
    setupPrimaryAction = null;

    showSetupModal({
      title: 'Lanzando dados',
      text: `${contextLabel}: ${playerLabel}.`,
      buttonLabel: 'Lanzando...',
      action: null,
      showDice: true,
      rollLabel: playerLabel,
      rollResult: 'Los dados están rodando...',
      die1: face1,
      die2: face2,
      tone
    });

    const i1 = document.getElementById('dieOne');
    const i2 = document.getElementById('dieTwo');
    setDieVisual(i1, face1);
    setDieVisual(i2, face2);

    const interval = setInterval(() => {
      face1 = randomDiceFace(1);
      face2 = randomDiceFace(2);
      setDieVisual(i1, face1);
      setDieVisual(i2, face2);
    }, 90);

    setTimeout(() => {
      clearInterval(interval);
      const total = face1.value + face2.value;
      const roll = { face1, face2, d1: face1.value, d2: face2.value, total };
      const summary = diceRewardSummary(roll);

      setDieVisual(i1, face1);
      setDieVisual(i2, face2);

      const resultEl = document.getElementById('setupRollResult');
      if (resultEl) resultEl.textContent = `${face1.value} + ${face2.value} = ${total} · ${summary}`;

      const buttonElDone = document.getElementById('rollSetupBtn');
      if (buttonElDone) {
        buttonElDone.disabled = false;
        buttonElDone.textContent = continueLabel;
      }

      setupPrimaryAction = () => {
        if (resolved) return;
        resolved = true;
        setupPrimaryAction = null;
        resolve(roll);
      };

      addLog(`${playerLabel} lanza dados: ${face1.value}-${face1.color} + ${face2.value}-${face2.color} = ${total}. ${summary}.`, tone);
    }, 1100);
  });
}


function beginSetupRollFlow() {
  showSetupModal({
    title: 'Inicio de partida',
    text: 'Turno del Jugador 1. Pulsa para lanzar los dados.',
    buttonLabel: 'Lanzar dados del Jugador 1',
    action: async () => {
      const blue = await diceSequence('blue', 'Inicio de partida', 'Lanzamiento del rival');
      const blueAnalysis = await applyDiceRewards('blue', blue, { source: 'inicio de partida' });
      const blueRecord = baseRollRecord('blue', blue, blueAnalysis);

      showSetupModal({
        title: 'Turno del Jugador 2',
        text: `Lanzamiento azul completado: ${blue.total}. Ahora lanza el Jugador 2.`,
        buttonLabel: 'Lanzar dados del Jugador 2',
        showDice: true,
        rollLabel: 'Jugador 1 · Azul',
        rollResult: `${blue.d1} + ${blue.d2} = ${blue.total} · ${diceRewardSummary(blue)}`,
        die1: blue.face1,
        die2: blue.face2,
        action: async () => {
          const red = await diceSequence('red', 'Inicio de partida', 'Continuar');
          const redAnalysis = await applyDiceRewards('red', red, { source: 'inicio de partida' });
          const redRecord = baseRollRecord('red', red, redAnalysis);

          await maybeRunCompensationRoll(blueRecord, redRecord);

          finishSetupRolls(blue.total, red.total, blue, red);
        }
      });
    }
  });
}


function finishSetupRolls(blueTotal, redTotal, blueRollData, redRollData) {
  if (blueTotal === redTotal) {
    showSetupModal({
      title: 'Empate en dados',
      text: `Empate: ambos jugadores sacaron ${blueTotal}. Se repetirá el lanzamiento.`,
      buttonLabel: 'Repetir lanzamientos',
      showDice: true,
      rollLabel: 'Empate',
      rollResult: `${blueRollData.d1}+${blueRollData.d2} = ${blueTotal} / ${redRollData.d1}+${redRollData.d2} = ${redTotal}`,
      die1: blueRollData.face1,
      die2: blueRollData.face2,
      action: () => beginSetupRollFlow(),
      tone: 'warn'
    });
    return;
  }

  setupState.rolled = true;
  setupState.firstChooser = blueTotal > redTotal ? 'blue' : 'red';
  setupState.secondChooser = setupState.firstChooser === 'blue' ? 'red' : 'blue';
  setupState.placingPlayer = setupState.firstChooser;
  setupState.phase = 'placeFirstUrban';

  const winner = playerState[setupState.firstChooser].name;
  const firstTurn = playerState[setupState.secondChooser].name;
  showSetupModal({
    title: 'Resultado del setup',
    text: `Ganador: ${winner}. Coloca primero su Asentamiento Urbano. Primer turno real: ${firstTurn}.`,
    buttonLabel: 'Comenzar colocación',
    showDice: true,
    rollLabel: 'Resultado final',
    rollResult: `Azul ${blueTotal} · Rojo ${redTotal}`,
    die1: blueRollData.face1,
    die2: blueRollData.face2,
    action: () => {
      hideSetupModal();
      addLog(`${winner} coloca primero su Asentamiento Urbano.`, 'gold');
      drawBoard();
    },
    tone: 'gold'
  });
  drawBoard();
}

function setActiveHudPlayer(player = currentPlayer) {
  activeHudPlayer = player;
  document.getElementById('hudBlueTab')?.classList.toggle('active', player === 'blue');
  document.getElementById('hudRedTab')?.classList.toggle('active', player === 'red');
  renderHud();
}

function updateHudTurnTabs() {
  activeHudPlayer = currentPlayer;
  document.getElementById('hudBlueTab')?.classList.toggle('active', currentPlayer === 'blue');
  document.getElementById('hudRedTab')?.classList.toggle('active', currentPlayer === 'red');
}

function hudItem(icon, label, count, pending = 0) {
  return `<div class="hud-item"><img src="${icon}" alt="" /><span>${label}</span><strong>${count}${pending > 0 ? ` <em class="pending-mark">⏳${pending}</em>` : ''}</strong></div>`;
}

function renderHud() {
  activeHudPlayer = currentPlayer;
  updateHudTurnTabs();
  const state = normalizeDebtState(currentPlayer);
  if (!state) return;

  const iconOwner = currentPlayer === 'red' ? 'red' : 'blue';

  const buildingDefs = [
    ['urban', 'Asent. urbanos'],
    ['house', 'Casas'],
    ['market', 'Mercados'],
    ['port', 'Puertos'],
    ['settlement', 'Puestos com.'],
    ['temple', 'Templos'],
    ['exploration', 'Exploración']
  ];
  const buildings = buildingDefs
   .filter(([key]) => (state.buildings[key] || 0) > 0 || getPendingCount(currentPlayer, 'buildings', key) > 0)
   .map(([key, label]) => {
    const icon = {
      urban: `assets/buildings/urban-${iconOwner}.png`,
      house: `assets/buildings/house-${iconOwner}.png`,
      market: `assets/buildings/market-${iconOwner}.png`,
      port: `assets/buildings/port-${iconOwner}.png`,
      settlement: `assets/buildings/settlement-${iconOwner}.png`,
      temple: `assets/buildings/church-${iconOwner}.png`,
      exploration: `assets/buildings/exploration-${iconOwner}.png`
    }[key];
    return hudItem(icon, label, state.buildings[key] || 0, getPendingCount(currentPlayer, 'buildings', key));
  }).join('');

  const unitDefs = [
    ['villager', 'Aldeanos'],
    ['samurai', 'Samuráis'],
    ['cavalry', 'Caballería'],
    ['monk', 'Monjes'],
    ['diplomat', 'Daimio'],
    ['ninja', 'Ninjas'],
    ['geisha', 'Geishas']
  ];
  const units = unitDefs
   .filter(([key]) => (state.units[key] || 0) > 0 || getPendingCount(currentPlayer, 'units', key) > 0)
   .map(([key, label]) => {
    let icon = hudIcons[key];
    if (key === 'villager') icon = villagerAsset(iconOwner);
    if (key === 'diplomat') icon = daimyoAsset(iconOwner);
    return hudItem(icon, label, state.units[key] || 0, getPendingCount(currentPlayer, 'units', key));
  }).join('');

  const resources = ['wood', 'stone', 'gold', 'food', 'metal']
    .filter(type => (state.resources[type] || 0) > 0)
    .map(type =>
      `<div class="hud-item resource"><img src="${resourceAssets[type]}" alt="" /><span>${resourceNames[type]}</span><strong>${state.resources[type]}</strong></div>`
    ).join('') + ((state.debt || 0) > 0 ? `<div class="hud-item debt"><span>Deuda</span><strong>${state.debt}</strong></div>` : '');

  const cards = ['tactic','trade'].map(type => {
    const count = getPlayerCards(currentPlayer, type).length;
    const meta = inventoryTypeMeta[type];
    return `<button class="card-slot ${count <= 0 ? 'empty-card-slot' : ''}" onclick="openCardInventory('${type}')">
      <span class="card-slot-frame">
        <span class="card-slot-count">${count}</span>
        <img src="${meta.icon}" alt="${meta.label}" />
      </span>
      <span class="card-slot-label">${type === 'tactic' ? 'Bat.' : 'Com.'}</span>
    </button>`;
  }).join('');

  document.getElementById('hudBuildings').innerHTML = buildings;
  document.getElementById('hudUnits').innerHTML = units;
  document.getElementById('hudResources').innerHTML = resources;
  const cardsEl = document.getElementById('hudCards');
  if (cardsEl) cardsEl.innerHTML = cards;
}

function resetPlayerState() {
  prospectiveSparseUrbanHintTileId = null;
  ['blue', 'red'].forEach(player => {
    const state = playerState[player];
    state.resources = { wood: 2, stone: 2, gold: 2, food: 2, metal: 0 };
    state.buildings = { urban: 0, house: 0, market: 0, extraction: 0, militaryComplex: 0, militaryCamp: 0, port: 0, settlement: 0, temple: 0, exploration: 0 };
    state.units = { villager: 0, archer: 0, samurai: 0, yariMonk: 0, cavalry: 0, monk: 0, diplomat: 0, ninja: 0, geisha: 0 };
    state.maxVillagers = 3;
    state.debt = 0;
    state.marketRateBonus = 0;
    state.marketNetwork = null;
    state.initialTradeProtection = null;
    state.resourceConvoys = [];
    state.debtLedger = emptyResourceCounts();
    state.debtAge = 0;
    state.pending = { buildings: {}, units: {} };
    state.cards = { trade: 0, tactic: 0 };
    state.cardInventory = { trade: [], tactic: [] };
    state.lastVillagerIncomeSeason = null;
  });
  activationQueue = [];
  Object.keys(playerBuildingCards).forEach(id => delete playerBuildingCards[id]);
  Object.keys(pointUnits).forEach(id => delete pointUnits[id]);
}

function closeCardInventory() {
  if (frontModalMode === 'debt') return;
  hideFrontModal();
}

function hideFrontModal({ force = false } = {}) {
  if (!force && frontModalMode === 'debt') return;
  const modal = document.getElementById('cardInventoryModal');
  const closeBtn = document.querySelector('.card-modal-close');
  const body = document.getElementById('cardInventoryBody');
  if (modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
  if (closeBtn) closeBtn.style.display = '';
  if (body) body.className = 'card-modal-body';
  frontModalMode = null;
}

function openFrontModal({ mode = 'info', title = '', subtitle = '', bodyHtml = '', closable = true, bodyClass = 'card-modal-body' } = {}) {
  const modal = document.getElementById('cardInventoryModal');
  const titleEl = document.getElementById('cardModalTitle');
  const subtitleEl = document.getElementById('cardModalSubtitle');
  const body = document.getElementById('cardInventoryBody');
  const closeBtn = document.querySelector('.card-modal-close');
  if (!modal || !titleEl || !subtitleEl || !body) return;
  frontModalMode = mode;
  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;
  body.className = bodyClass;
  body.innerHTML = bodyHtml;
  if (closeBtn) closeBtn.style.display = closable ? '' : 'none';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function openCardInventory(type) {
  const cards = getPlayerCards(currentPlayer, type);
  if (!cards.length) {
    addLog(`No tienes ${inventoryTypeMeta[type].label.toLowerCase()} disponibles.`, 'warn');
    return;
  }
  const modal = document.getElementById('cardInventoryModal');
  const closeBtn = document.querySelector('.card-modal-close');
  const title = document.getElementById('cardModalTitle');
  const subtitle = document.getElementById('cardModalSubtitle');
  const body = document.getElementById('cardInventoryBody');
  if (!modal || !title || !subtitle || !body) return;
  frontModalMode = 'cards';
  if (closeBtn) closeBtn.style.display = '';
  body.className = 'card-modal-body';
  title.textContent = inventoryTypeMeta[type].label;
  subtitle.textContent = `${playerState[currentPlayer].name} · ${cards.length} disponible${cards.length !== 1 ? 's' : ''}`;
  body.innerHTML = cards.map((card, index) => `
    <article class="floating-card ${ownerClass(currentPlayer)}">
      <div class="floating-card-bg" style="background-image:url('${card.background}')"></div>
      <div class="floating-card-content">
        <header class="floating-card-header">
          <div class="floating-card-title-box">
            <h3>${card.title}</h3>
            <p>${card.subtitle}</p>
          </div>
          <div class="floating-card-icon-box"><img class="floating-card-icon" src="${card.icon}" alt="" /></div>
        </header>
        <footer class="floating-card-footer">
          <h3 class="card-section-title">Efecto</h3>
          <div class="benefit-list">
            <div class="benefit-item"><span class="benefit-dot">◆</span><span>${card.text}</span></div>
          </div>
          <div class="floating-card-actions">
            <button class="create-button" onclick="playInventoryCard('${type}', ${index})">Jugar</button>
          </div>
        </footer>
      </div>
    </article>
  `).join('') + `<button class="floating-cards-close" onclick="closeCardInventory()" aria-label="Cerrar cartas">×</button>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function playInventoryCard(type, index) {
  const cards = getPlayerCards(currentPlayer, type);
  const card = cards[index];
  if (!card) return;
  cards.splice(index, 1);
  playerState[currentPlayer].cards[type] = cards.length;

  if (card.effect) {
    Object.entries(card.effect).forEach(([resourceType, amount]) => {
      playerState[currentPlayer].resources[resourceType] = (playerState[currentPlayer].resources[resourceType] || 0) + amount;
    });
  }
  if (card.draw) {
    Object.entries(card.draw).forEach(([otherType, amount]) => awardCard(currentPlayer, otherType, amount, `efecto de ${card.title}`));
  }
  if (card.extraMove) {
    Object.values(pointUnits).forEach(unit => {
      if (unit.owner === currentPlayer && unit.type === 'daimyo') unit.extraMoves = (unit.extraMoves || 0) + 1;
    });
  }

  addLog(`${playerState[currentPlayer].name} juega ${card.title}.`, currentPlayer);
  renderHud();
  closeCardInventory();
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollForSettlementStart() { beginSetupRollFlow(); }

function skipSettlementSetup() { hideSetupModal(); }


function hasUrbanDistance(tileId, player) {
  const urbanCards = Object.values(playerBuildingCards).filter(card => isUrbanSettlementCard(card));
  return urbanCards.every(card => {
    if (card.owner === player) return true;
    const blocked = getCellsWithinRadius(card.tileId, 2);
    return !blocked.includes(tileId);
  });
}

function isValidUrbanStartTile(tileId, player) {
  if (!setupState.active || !setupState.rolled) return false;
  if (!(setupState.phase === 'placeFirstUrban' || setupState.phase === 'placeSecondUrban')) return false;
  if (setupState.placingPlayer !== player) return false;
  if (setupState.urbanPlaced?.[player]) return false;

  const cell = getCellById(tileId);
  if (!cell || cell.special || resourceAssignments[tileId] || playerBuildingCards[tileId]) return false;
  if (!isOuterCell(cell)) return false;
  if (!hasUrbanDistance(tileId, player)) return false;

  if (setupState.firstSettlementTile && player === setupState.secondChooser) {
    // Los dominios urbanos no pueden tocarse ni superponerse.
    // Se bloquea radio 2 alrededor del primer Asentamiento Urbano,
    // dejando al menos dos casillas de separación entre centros urbanos.
    const blocked = getCellsWithinRadius(setupState.firstSettlementTile, 2);
    if (blocked.includes(tileId)) return false;
  }

  return true;
}

function urbanCreationOptionsFor(player) {
  const hasSecondUrban = (playerState[player]?.buildings?.urban || 0) >= 2;
  const base = [
    { id: "villager", name: "Aldeano", icon: villagerAsset(player), limitText: "Cada Asentamiento Urbano permite 3 aldeanos base. Cada Casa agrega +2 capacidad.", cost: { food: 2 }, effect: "Recolecta 2 recursos por estación. Si trabaja en una Base de Extracción, el recurso puede tardar 1 o 2 turnos en llegar." },
    { id: "house", name: "Casa", icon: `assets/buildings/house-${player}.png`, cost: { wood: 2 }, effect: "+2 capacidad de aldeanos. Con el segundo Asentamiento Urbano se desbloquean 2 Casas adicionales." },
    { id: "market", name: "Mercado", icon: `assets/buildings/market-${player}.png`, cost: { wood: 3, stone: 2, gold: 1 }, effect: "Canje dinámico. Es más costoso que las casas, pero con un segundo Mercado se desbloquea la Red de Mercados." },
    { id: "urban", name: "Asentamiento Urbano", icon: `assets/buildings/urban-${player}.png`, cost: { wood: 2, stone: 2 }, effect: "Expande tu centro civil. Los nuevos Asentamientos se colocan en anillo 1 o 2 alrededor de un Asentamiento Urbano activo." }
  ];
  if (hasSecondUrban) {
    base.push(
      { id: "extraction", name: "Base de Extracción", icon: `assets/buildings/extraction-${player}.png`, cost: { wood: 2, stone: 1 }, effect: "Se construye sobre una casilla con recurso hasta 2 anillos fuera de la influencia urbana. Permite colocar aldeanos allí y transportar recursos con retraso." },
      { id: "militaryComplex", name: "Complejo Militar", icon: `assets/buildings/military-complex-${player}.png`, cost: { wood: 3, stone: 2, metal: 1 }, effect: "Primer edificio militar. Permite gestionar la creación de arqueros y samuráis, pero solo podrá crear tropas cuando tengas un Campamento Militar activo." },
      { id: "militaryCamp", name: "Campamento Militar", icon: `assets/buildings/military-camp-${player}.png`, cost: { wood: 3, food: 1 }, effect: "Requiere Complejo Militar activo. Alberga hasta 500 unidades y habilita la creación de tropas desde el Complejo Militar." }
    );
  }
  return base;
}

function createUrbanSettlementCard(tileId, player) {
  const ownerLabel = player === 'blue' ? 'Azul' : 'Rojo';
  return {
    id: `asentamiento-urbano-${player}-${tileId}`,
    tileId,
    name: `Asentamiento Urbano ${ownerLabel}`,
    category: "civil",
    categoryLabel: "Edificio Civil · Asentamiento Urbano",
    owner: player,
    influenceRadius: 1,
    background: "assets/cards/asentamiento-urbano-bg.png",
    acquisitionCost: {},
    reconstructionCost: { wood: 4, stone: 3 },
    annualBenefit: {},
    annualContractTax: {},
    annualMaintenanceCost: { wood: 1, gold: 1 },
    isPlayerBuilt: true,
    buildingKind: "urban",
    creationOptions: urbanCreationOptionsFor(player)
  };
}

function placeUrbanSettlement(tileId, player) {
  prospectiveSparseUrbanHintTileId = null;
  if (!isValidUrbanStartTile(tileId, player)) {
    addLog('Casilla inválida para Asentamiento Urbano inicial, o ese jugador ya colocó su asentamiento.', 'warn');
    return false;
  }

  if (setupState.urbanPlaced?.[player]) {
    addLog(`${playerState[player].name} ya colocó su Asentamiento Urbano inicial.`, player);
    return false;
  }
  const cell = getCellById(tileId);
  cell.special = {
    kind: 'urban',
    name: player === 'blue' ? 'Asentamiento Urbano Azul' : 'Asentamiento Urbano Rojo',
    description: 'Centro urbano inicial del jugador.'
  };
  playerBuildingCards[tileId] = createUrbanSettlementCard(tileId, player);
  builtSpecialTiles.add(tileId);
  setupState.urbanPlaced[player] = true;
  if (player === setupState.firstChooser) setupState.firstSettlementTile = tileId;
  playerState[player].buildings.urban += 1;
  refreshPlayerCaps(player);
  setActiveHudPlayer(player);
  renderHud();
  drawBoard();
  selectedId = tileId;
  renderTileInfoForCell(cell);
  renderBuildingCard(tileId);
  showInfluence(tileId, 1, player);
  beginInitialVillagerPlacement(player, tileId);
  return true;
}

function beginInitialVillagerPlacement(player, urbanTileId) {
  setupState.phase = player === setupState.firstChooser ? 'placeFirstVillager' : 'placeSecondVillager';
  setupState.placingPlayer = null;

  placementMode = {
    type: 'initialVillager',
    sourceTileId: urbanTileId,
    player,
    cost: {},
    option: {
      id: 'initialVillager',
      name: 'Aldeano inicial',
      icon: villagerAsset(player),
      effect: 'Primer trabajador civil del asentamiento. Recolecta 2 recursos por estación al inicio de su turno, desde la casilla donde se coloca.'
    },
    setupPlacement: true
  };

  const valid = validPlacementTilesFor(placementMode);
  if (!valid.length) {
    addLog(`${playerState[player].name} no tiene recursos dentro del dominio inicial. Se omite el aldeano inicial por ahora.`, "warn");
    finishInitialVillagerPlacement(player);
    return;
  }

  setSetupMessage(`${playerState[player].name}: coloca tu Aldeano inicial en una casilla con recurso dentro del dominio urbano.`, player);
  renderActionCard(placementMode.option, playerBuildingCards[urbanTileId], true);
  drawBoard();
}

function finishInitialVillagerPlacement(player) {
  placementMode = null;
  setupState.villagerPlaced[player] = true;

  const urbanTileId = player === setupState.firstChooser ? setupState.firstSettlementTile : Object.values(playerBuildingCards).find(card => isUrbanSettlementCard(card) && card.owner === player)?.tileId;
  if (setupState.phase === 'placeFirstVillager' || setupState.phase === 'placeSecondVillager') {
    beginInitialDaimyoPlacement(player, urbanTileId);
  }

  renderHud();
  drawBoard();
}

function renderCreationOption(option, player) {
  const type = option.id === 'initialVillager' ? 'villager' : option.id;
  const limitBlocked = isConstructionLimitBlocked(player, type);
  const turnBlocked = !canCurrentPlayerActAs(player);
  const disabled = option.locked ? 'disabled' : '';
  const events = option.locked ? '' : `onclick="openCreationInfo('${option.id}')"`;
  const blockedClass = `${limitBlocked ? ' limit-blocked-option' : ''}${turnBlocked ? ' turn-blocked-option' : ''}`;
  return `<button class="creation-option ${option.locked ? 'locked-option' : ''}${blockedClass}" ${events} ${disabled}>
    <span class="creation-token-wrap">
      <img src="${option.icon}" alt="${option.name}" />
      ${creationOptionBadge(option, player)}
    </span>
    <span>${option.name}</span>
  </button>`;
}

function openCreationInfo(optionId) {
  const activeCard = playerBuildingCards[selectedId] || buildingCards[selectedId];
  if (activeCard && isUrbanSettlementCard(activeCard)) activeCard.creationOptions = urbanCreationOptionsFor(activeCard.owner);
  const option = activeCard?.creationOptions?.find(o => o.id === optionId);
  if (!option || option.locked) return;
  renderActionCard(option, activeCard);

  // v1.0.8: seleccionar cualquier opción creable activa directamente el modo rápido
  // de colocación en arena. El jugador toca una casilla válida y confirma Crear / No crear.
  if (quickCreatableTypes.includes(optionId)) {
    beginPlacement(optionId, activeCard.tileId, { keepActionCardVisible: true, silent: true });
  }
}


function scheduleActionCardHide() {
  // La tarjeta secundaria solo se cierra con el botón Cerrar
  // o cuando se confirma Crear / Construir.
  return;
}

function cancelActionCardHide() {
  clearTimeout(actionCardHideTimer);
}

function hideActionCardOnly() {
  if (placementMode) return;
  actionCard.className = "mini-action-card empty-mini-card hidden-action-card";
}




function initialTradeProtectionActive(player) {
  const protection = playerState[player]?.initialTradeProtection;
  return !!(protection && protection.active && currentYear <= protection.expiresAtYear);
}

function initialTradeProtectionResource(player) {
  return null;
}

function startInitialTradeProtection(player, resourceType = null, tileId = null) {
  if (!player) return;
  playerState[player].initialTradeProtection = {
    active: true,
    resourceType: resourceType || null,
    tileId: tileId || null,
    startYear: currentYear,
    expiresAtYear: currentYear + 1,
    notifiedEnd: false,
    universal: true
  };
  addLog(`${playerState[player].name} recibe Protección Compensatoria Inicial: Mercado 1:1 y Tradeo Urbano 2:1 durante el primer año.`, player);
}

function startInitialTradeProtectionForAllPlayers() {
  ['blue', 'red'].forEach(player => startInitialTradeProtection(player));
}

function initialTradeProtectionNote(player, mode) {
  if (!initialTradeProtectionActive(player)) return '';
  const rate = mode === 'market' ? '1:1' : '2:1';
  const label = mode === 'market' ? 'Mercado' : 'Asentamiento Urbano';
  return `<p class="mini-note sparse-rate-note">🛡 <strong>Protección Compensatoria Inicial:</strong> durante el primer año todos los jugadores reciben ayuda económica para desarrollarse de forma equilibrada. En ${label}, la tasa temporal es <strong>${rate}</strong>. Al cerrar el primer año, la compensación termina.</p>`;
}

function showInitialTradeProtectionGranted(player = null, resourceType = null, tileId = null) {
  const subtitle = player ? `${playerState[player].name} · Año ${currentYear}` : `Todos los jugadores · Año ${currentYear}`;
  openFrontModal({
    mode: 'initialTradeProtection',
    title: 'Protección Compensatoria Inicial',
    subtitle,
    closable: true,
    bodyClass: 'card-modal-body single-front-card-body',
    bodyHtml: `<article class="floating-card debt-front-card annual-benefits-front-card initial-trade-protection-card">
      <div class="floating-card-bg" style="background-image:url('assets/cards/debt-council-bg.png')"></div>
      <div class="floating-card-content">
        <header class="floating-card-header"><div class="floating-card-title-box"><h3>Protección compensatoria inicial</h3><p>El imperio estabiliza el primer año de desarrollo.</p></div><div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div></header>
        <footer class="floating-card-footer annual-benefit-summary">
          <p>Durante el <strong>primer año</strong>, todos los jugadores reciben una compensación económica. Ya no depende de estar en una casilla pobre o especial: es una regla global para que ambos bandos puedan abrir su economía sin quedarse atascados por el mapa inicial.</p>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Mercado:</strong> mientras dure la compensación, los canjes de Mercado tienen relación <strong>1:1</strong>.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Asentamiento Urbano:</strong> mientras dure la compensación, el tradeo urbano tiene relación <strong>2:1</strong>. Al terminar la compensación vuelve a <strong>4:1</strong>.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Fin:</strong> al cerrar el primer año, después de impuestos y beneficios anuales, esta protección se elimina automáticamente.</span></div>
          <button class="create-button" onclick="hideFrontModal({ force: true })">Entendido</button>
        </footer>
      </div>
    </article>`
  });
}

function protectionExpiryPlayers() {
  return ['blue','red'].filter(player => {
    const protection = playerState[player]?.initialTradeProtection;
    return protection && protection.active && !protection.notifiedEnd && protection.expiresAtYear <= currentYear;
  });
}

function showInitialTradeProtectionExpired(players) {
  if (!players || !players.length) return Promise.resolve();
  return new Promise(resolve => {
    initialTradeProtectionResolver = resolve;
    const rows = players.map(player => `<div class="annual-benefit-row ${ownerClass(player)}">
        <img src="${categoryAssets.economico}" alt="" />
        <div class="annual-benefit-row-text"><strong>${playerState[player].name}</strong><span>Terminó la Protección Compensatoria Inicial. Mercado vuelve a sus tasas normales y el Tradeo Urbano vuelve a 4:1.</span></div>
      </div>`).join('');
    openFrontModal({
      mode: 'initialTradeProtectionEnd',
      title: 'Fin de protección compensatoria',
      subtitle: `Año ${currentYear}`,
      closable: false,
      bodyClass: 'card-modal-body single-front-card-body',
      bodyHtml: `<article class="floating-card debt-front-card annual-benefits-front-card">
        <div class="floating-card-bg" style="background-image:url('assets/cards/debt-council-bg.png')"></div>
        <div class="floating-card-content">
          <header class="floating-card-header"><div><h3>Terminó la protección compensatoria</h3><p>La ayuda económica inicial del imperio ha concluido.</p></div><div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div></header>
          <footer class="floating-card-footer annual-benefit-summary">${rows}<button class="create-button" onclick="closeInitialTradeProtectionExpired()">Continuar</button></footer>
        </div>
      </article>`
    });
  });
}

function closeInitialTradeProtectionExpired() {
  const players = protectionExpiryPlayers();
  players.forEach(player => {
    if (playerState[player]?.initialTradeProtection) {
      playerState[player].initialTradeProtection.active = false;
      playerState[player].initialTradeProtection.notifiedEnd = true;
    }
  });
  const resolver = initialTradeProtectionResolver;
  initialTradeProtectionResolver = null;
  hideFrontModal({ force: true });
  if (typeof resolver === 'function') resolver();
}

function tradeRateForReceive(mode, player, type) {
  if (mode === 'market' && initialTradeProtectionActive(player)) return 1;
  if (mode === 'urban' && initialTradeProtectionActive(player)) return 2;
  return normalTradeRateForReceive(mode, player, type);
}

function tradeRateReason(mode, player, type) {
  if (mode === 'market' && initialTradeProtectionActive(player)) return 'Protección compensatoria · 1:1';
  if (mode === 'urban' && initialTradeProtectionActive(player)) return 'Protección compensatoria · 2:1';
  if (mode === 'market') return normalTradeRateForReceive(mode, player, type) === 2 ? 'producido/cerca' : 'demanda alta';
  if (mode === 'urban') return 'tradeo urbano base';
  return 'emergencia';
}

function sparseTradeRateNote(player, mode) {
  return initialTradeProtectionNote(player, mode);
}

function closeSparseTradeInfo() {
  clearTimeout(actionCardHideTimer);
  actionCard.onmouseenter = null;
  actionCard.onmouseleave = null;
  actionCard.className = "mini-action-card empty-mini-card hidden-action-card";
  actionCard.innerHTML = `<div class="mini-card-content"><h2>Tarjeta de creación</h2><p>Haz clic en una opción del Asentamiento Urbano.</p><p class="mini-note">Aldeano, Casa, Mercado o expansión urbana.</p></div>`;
  drawBoard();
}

function openProspectiveSparseTradeInfo(tileId, player = setupState.placingPlayer || currentPlayer) {
  const type = sparseStartingResourceForUrban(tileId);
  if (!type) return;
  prospectiveSparseUrbanHintTileId = tileId;
  actionCard.className = `mini-action-card action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-content sparse-info-card">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>Posible protección comercial inicial</h2>
          <p>Ayuda para el segundo asentamiento</p>
        </div>
        <div class="mini-category-icon" title="Economía">!</div>
      </header>
      <section class="mini-action-body">
        <p class="mini-note">La casilla marcada en el mapa es la ubicación exacta donde este recurso activa la ventaja. Si colocas el Asentamiento Urbano en otra casilla, el beneficio puede no aplicar.</p>
        <p class="mini-note">Esa ubicación tiene cerca solamente <strong>${resourceNames[type]}</strong>. No te da variedad inicial, pero si colocas ahí tu Asentamiento Urbano recibirás Protección de Comercio Inicial durante 1 año.</p>
        <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Protección temporal:</strong> todos tus canjes de Mercado y Asentamiento Urbano tendrán relación <strong>1:1</strong> durante el primer año.</span></div>
        <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Fin de protección:</strong> al cerrar el año, después de impuestos y beneficios anuales, la protección termina.</span></div>
        <p class="mini-note">La casilla marcada es la que activa esta protección. Si eliges otra ubicación, puede no aplicar.</p>
        <button class="cancel-button" onclick="closeSparseTradeInfo()">Cerrar</button>
      </section>
    </div>`;
  drawBoard();
}

function openSparseTradeInfo(tileId) {
  const type = resourceAssignments[tileId];
  if (!type) return;
  const owners = Object.values(playerBuildingCards)
    .filter(card => isUrbanSettlementCard(card) && sparseStartingResourceForUrban(card.tileId) === type && getCellsWithinRadius(card.tileId, 1).includes(tileId))
    .map(card => card.owner);
  const ownerText = owners.length ? owners.map(owner => playerState[owner]?.name || owner).join(' / ') : 'esta ubicación';
  actionCard.className = `mini-action-card action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-content sparse-info-card">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>Protección comercial inicial</h2>
          <p>${resourceNames[type]} · ${ownerText}</p>
        </div>
        <div class="mini-category-icon" title="Balance comercial">⚠</div>
      </header>
      <section class="mini-action-body">
        <p class="mini-note">Esta ubicación inicial quedó con recursos limitados. Para que el jugador no quede frenado al inicio, el imperio puede otorgar una Protección de Comercio Inicial temporal.</p>
        <div class="benefit-list">
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Primer año:</strong> todos los canjes del jugador protegido funcionan a relación <strong>1:1</strong>.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Después del año:</strong> la protección termina y vuelven las tasas normales.</span></div>
        </div>
        <button class="cancel-button" onclick="clearActionCard()">Cerrar</button>
      </section>
    </div>`;
}

function tradeReceiveButton(type, mode, player) {
  const rate = tradeRateForReceive(mode, player, type);
  return `<div class="trade-resource-choice" data-resource="${type}" onclick="setTradeReceive('${type}')">
    <span id="tradeReceiveBadge-${type}" class="trade-receive-badge hidden">0</span>
    <button class="trade-receive-minus" title="Quitar 1" onclick="event.stopPropagation(); changeTradeReceive('${type}', -1)">−</button>
    <img src="${resourceAssets[type]}" alt="${resourceNames[type]}"/>
    <span>${resourceNames[type]}</span>
    <small class="trade-rate-pill">${rate}:1</small>
  </div>`;
}

function canInteractWithFixedBuilding(card) {
  if (!card) return false;
  if (card.isPlayerBuilt) return isCardOperational(card);
  if (card.owner !== 'neutral') return true;
  return false;
}

function renderLockedBuildingCard(card) {
  buildingCard.className = 'building-info-card empty-card';
  buildingCard.innerHTML = `<div class="empty-card-content">
    <h2>${card?.name || 'Edificio neutral'}</h2>
    <p>Este edificio fijo no puede usarse todavía.</p>
    <p class="mini-note">${neutralInteractionRequirement(card)}</p>
  </div>`;
}

function neutralInteractionRequirement(card) {
  if (!card) return 'Requiere interacción especial.';
  if (isExplorationPostCard(card)) return 'Vista previa táctica. Para interactuar necesitas una Legión en una casilla circundante.';
  if (isTempleCard(card)) return 'Vista previa táctica. Para consagrar necesitas influencia, requisitos religiosos y presencia circundante.';
  return 'Vista previa táctica. Para interactuar necesitas Daimio/Diplomático en la zona.';
}

function openUrbanTrade(tileId) {
  const card = playerBuildingCards[tileId] || buildingCards[tileId];
  if (!card || !isUrbanSettlementCard(card)) return;
  if (!isCardOperational(card)) { addLog('Este Asentamiento Urbano todavía está en preparación.', 'warn'); return; }
  const player = card.owner;
  if (!canCurrentPlayerActAs(player)) {
    addLog(turnLockedMessage(player), 'warn');
    return;
  }
  const resources = playerState[player].resources;
  const options = ['wood','stone','gold','food','metal'];

  actionCard.className = `mini-action-card ${ownerClass(player)} action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('${card.background}')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>Tradeo Urbano</h2>
          <p>Asentamiento Urbano · Canje de emergencia</p>
        </div>
        <div class="mini-category-icon" title="Edificio Civil">${categoryIcon({ category: 'civil', categoryLabel: 'Edificio Civil' })}</div>
      </header>
      <section class="mini-action-body">
        <p class="mini-note">Entrega recursos variados para recibir recursos elegidos. Puedes mezclar recursos mientras tengas cantidad disponible.</p>
        ${sparseTradeRateNote(player, 'urban')}
        <h3>1. Recurso que quieres recibir</h3>
        <div class="trade-receive-row">
          ${options.map(type => tradeReceiveButton(type, 'urban', player)).join('')}
        </div>
        <h3>2. Recursos que entregas</h3>
        <div id="tradeGiveRows" class="trade-give-rows">
          ${options.map(type => tradeGiveRow(type, resources[type] || 0)).join('')}
        </div>
        <div id="tradeSummary" class="trade-summary">Selecciona el recurso que quieres. Durante el primer año compensatorio, el tradeo urbano cuesta 2 recursos por cada recurso recibido; después vuelve a 4:1.</div>
        <div class="trade-action-row"><button class="create-button compact-confirm" onclick="executeUrbanTrade('${tileId}')">Confirmar</button><button class="trade-open-button quick-trade-btn" title="Calcula una propuesta de pago; no confirma el canje" onclick="applyQuickTradeBalance()">Tradeo rápido</button></div>
        <button class="cancel-button" onclick="clearActionCard()">Cerrar</button>
      </section>
    </div>`;
  currentTrade = { mode: 'urban', tileId, player, receive: null, receiveCounts: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 }, give: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 }, required: 4 };
  actionCard.onmouseenter = cancelActionCardHide;
  actionCard.onmouseleave = scheduleActionCardHide;
  refreshTradeSummary();
}

function tradeGiveRow(type, available) {
  return `<div class="trade-give-row">
    <span><img src="${resourceAssets[type]}" alt="${resourceNames[type]}"/> ${resourceNames[type]} <small>tienes ${available}</small></span>
    <div class="trade-stepper">
      <button onclick="changeTradeGive('${type}', -1)">−</button>
      <strong id="tradeGive-${type}">0</strong>
      <button onclick="changeTradeGive('${type}', 1)">+</button>
    </div>
  </div>`;
}


function applyQuickTradeBalance() {
  if (!currentTrade) return;
  updateTradeRequiredFromReceive();
  const required = currentTrade.required || 0;
  if (required <= 0) {
    addLog('Primero elige qué recurso quieres recibir.', 'warn');
    return;
  }
  const player = currentTrade.player;
  const resources = playerState[player].resources;
  const allowedTypes = resourceTypes.slice();
  currentTrade.give = emptyResourceCounts();
  let remaining = required;
  while (remaining > 0) {
    const candidates = allowedTypes
      .filter(type => (resources[type] || 0) > (currentTrade.give[type] || 0))
      .sort((a, b) => {
        const netA = (resources[a] || 0) - (currentTrade.give[a] || 0);
        const netB = (resources[b] || 0) - (currentTrade.give[b] || 0);
        if (netB !== netA) return netB - netA;
        const priority = { metal: 0, stone: 1, gold: 2, wood: 3, food: 4 };
        return (priority[a] ?? 9) - (priority[b] ?? 9);
      });
    if (!candidates.length) break;
    currentTrade.give[candidates[0]] = (currentTrade.give[candidates[0]] || 0) + 1;
    remaining -= 1;
  }
  resourceTypes.forEach(type => {
    const label = document.getElementById(`tradeGive-${type}`);
    if (label) label.textContent = currentTrade.give[type] || 0;
  });
  if (remaining > 0) {
    addLog('No tienes suficientes recursos para completar ese tradeo rápido.', 'warn');
  } else {
    addLog('Tradeo rápido calculado. Revisa la selección y confirma si estás de acuerdo.', currentTrade.player);
  }
  refreshTradeSummary();
}

function updateTradeRequiredFromReceive() {
  if (!currentTrade) return;
  currentTrade.required = Object.entries(currentTrade.receiveCounts || {}).reduce((sum, [resourceType, qty]) => {
    if (!qty) return sum;
    return sum + tradeRateForReceive(currentTrade.mode, currentTrade.player, resourceType) * qty;
  }, 0);
}

function refreshTradeReceiveButtons() {
  if (!currentTrade) return;
  document.querySelectorAll('.trade-resource-choice').forEach(btn => btn.classList.remove('selected-trade-resource'));
  Object.entries(currentTrade.receiveCounts || {}).forEach(([resourceType, qty]) => {
    const badge = document.getElementById(`tradeReceiveBadge-${resourceType}`);
    if (badge) { badge.textContent = qty; badge.classList.toggle('hidden', qty <= 0); }
    const btn = document.querySelector(`.trade-resource-choice[data-resource="${resourceType}"]`);
    if (btn && qty > 0) btn.classList.add('selected-trade-resource');
  });
}

function changeTradeReceive(type, delta) {
  if (!currentTrade) return;
  currentTrade.receive = type;
  currentTrade.receiveCounts = currentTrade.receiveCounts || { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 };
  const current = currentTrade.receiveCounts[type] || 0;
  currentTrade.receiveCounts[type] = Math.max(0, current + delta);
  if (currentTrade.receiveCounts[type] <= 0 && currentTrade.receive === type) {
    const nextEntry = Object.entries(currentTrade.receiveCounts).find(([, qty]) => qty > 0);
    currentTrade.receive = nextEntry ? nextEntry[0] : null;
  }
  updateTradeRequiredFromReceive();
  refreshTradeReceiveButtons();
  refreshTradeSummary();
}

function setTradeReceive(type) {
  changeTradeReceive(type, 1);
}

function changeTradeGive(type, delta) {
  if (!currentTrade) return;
  const resources = playerState[currentTrade.player].resources;
  const required = currentTrade.required || 4;
  const total = Object.values(currentTrade.give).reduce((sum, value) => sum + value, 0);
  const current = currentTrade.give[type] || 0;
  const maxAvailable = resources[type] || 0;
  if (delta > 0 && total >= required) return;
  const next = Math.max(0, Math.min(maxAvailable, current + delta));
  currentTrade.give[type] = next;
  const label = document.getElementById(`tradeGive-${type}`);
  if (label) label.textContent = next;
  refreshTradeSummary();
}

function refreshTradeSummary() {
  if (!currentTrade) return;
  const total = Object.values(currentTrade.give).reduce((sum, value) => sum + value, 0);
  const required = currentTrade.required || 0;
  const receiveCounts = currentTrade.receiveCounts || {};
  const receiveText = Object.entries(receiveCounts)
    .filter(([, qty]) => qty > 0)
    .map(([type, qty]) => `${qty} ${resourceNames[type]}`)
    .join(', ') || 'sin elegir';
  const payHint = initialTradeProtectionActive(currentTrade.player) ? (currentTrade.mode === 'market' ? ' Protección Compensatoria activa: Mercado 1:1.' : ' Protección Compensatoria activa: Tradeo Urbano 2:1.') : '';
  const summary = document.getElementById('tradeSummary');
  if (summary) summary.textContent = `Recibirás: ${receiveText}. Entregas: ${total}/${required} recursos.${payHint}`;
}

function executeUrbanTrade(tileId) {
  if (!currentTrade || currentTrade.tileId !== tileId) return;
  const total = Object.values(currentTrade.give).reduce((sum, value) => sum + value, 0);
  const required = currentTrade.required || 0;
  const receiveCounts = currentTrade.receiveCounts || {};
  const receiveTotal = Object.values(receiveCounts).reduce((sum, value) => sum + value, 0);
  if (!receiveTotal || total !== required) {
    addLog(`Tradeo inválido: selecciona recursos a recibir y entrega exactamente ${required} recursos.`, 'warn');
    refreshTradeSummary();
    return;
  }
  const player = currentTrade.player;
  if (!canCurrentPlayerActAs(player)) { addLog(turnLockedMessage(player), 'warn'); return; }
  if (!canAfford(player, currentTrade.give)) { addLog('No tienes suficientes recursos para ese tradeo.', 'warn'); return; }
  payCost(player, currentTrade.give);
  Object.entries(receiveCounts).forEach(([type, qty]) => { if (qty > 0) playerState[player].resources[type] = (playerState[player].resources[type] || 0) + qty; });
  addLog(`${playerState[player].name} hace tradeo ${currentTrade.mode === 'market' ? 'de Mercado' : 'urbano'} y recibe ${Object.entries(receiveCounts).filter(([,q])=>q>0).map(([t,q])=>`+${q} ${resourceNames[t]}`).join(', ')}.`, player);
  currentTrade = null;
  renderHud();
  clearActionCard();
}



function playerProducesResource(player, resourceType) {
  return Object.entries(placedUnits).some(([tileId, unit]) =>
    unit && unit.owner === player && unit.type === 'villager' && ((unit.gathers || resourceAssignments[tileId]) === resourceType)
  );
}

function sparseStartingResourceForUrban(urbanTileId) {
  return null;
}

function prospectiveSparseUrbanForResourceTile(resourceTileId, player = setupState.placingPlayer) {
  return null;
}

function playerSparseStartingResources(player) {
  return new Set();
}

function hasSparseStartingResourceRate(player, resourceType) {
  return false;
}

function sparseTradeGiveTypes(player) {
  return [];
}

function sparseTradeSpecialApplies(mode, player, receiveType = null) {
  return false;
}

function sparseTradeSpecialRate(mode) {
  return mode === 'market' ? 1 : 2;
}

function normalTradeRateForReceive(mode, player, type) {
  if (mode === 'market') {
    const baseRate = (playerProducesResource(player, type) || playerHasResourceNearUrban(player, type)) ? 2 : 3;
    return Math.max(1, baseRate - (playerState[player]?.marketRateBonus || 0));
  }
  if (mode === 'urban') return 4;
  return 4;
}

function playerHasResourceNearUrban(player, resourceType) {
  const urbanIds = Object.values(playerBuildingCards)
    .filter(card => isUrbanSettlementCard(card) && card.owner === player)
    .map(card => card.tileId);

  return Object.entries(resourceAssignments).some(([tileId, type]) => {
    if (type !== resourceType) return false;
    return urbanIds.some(urbanId => getCellsWithinRadius(urbanId, 1).includes(tileId));
  });
}

function playerNaturalResourceAccessTypes(player) {
  const access = new Set();

  Object.values(playerBuildingCards).forEach(card => {
    if (!card || card.owner !== player || !isCardOperational(card)) return;
    if (isUrbanSettlementCard(card)) {
      getCellsWithinRadius(card.tileId, 1).forEach(tileId => {
        if (resourceAssignments[tileId]) access.add(resourceAssignments[tileId]);
      });
    }
    if (card.buildingKind === 'extraction' && resourceAssignments[card.tileId]) {
      access.add(resourceAssignments[card.tileId]);
    }
  });

  Object.entries(placedUnits).forEach(([tileId, unit]) => {
    if (!unit || unit.owner !== player || unit.type !== 'villager') return;
    const type = unit.gathers || resourceAssignments[tileId];
    if (type) access.add(type);
  });

  return Array.from(access);
}

function sparseTradeStillNeedsHelp(player, sparseType) {
  return false;
}

function getMarketRate(player, resourceType) {
  // Mercado: 2:1 si el recurso objetivo está cerca de tus dominios urbanos
  // o ya lo estás produciendo con aldeanos. Si no, demanda alta: 3:1.
  // La regla de recurso inicial escaso se aplica al recurso que ENTREGAS, no al que recibes.
  return normalTradeRateForReceive('market', player, resourceType);
}

function openMarketTrade(tileId) {
  const card = playerBuildingCards[tileId] || buildingCards[tileId];
  if (!card || card.buildingKind !== 'market') return;
  if (!isCardOperational(card)) { addLog('Este Mercado todavía está en preparación.', 'warn'); return; }
  const player = card.owner;
  if (!canCurrentPlayerActAs(player)) {
    addLog(turnLockedMessage(player), 'warn');
    return;
  }
  const resources = playerState[player].resources;
  const options = ['wood','stone','gold','food','metal'];

  currentTrade = { mode: 'market', tileId, player, receive: null, receiveCounts: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 }, give: { wood: 0, stone: 0, gold: 0, food: 0, metal: 0 }, required: 3 };

  actionCard.className = `mini-action-card ${ownerClass(player)} action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('${card.background}')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>Tradeo de Mercado</h2>
          <p>Mercado · Canje dinámico</p>
        </div>
        <div class="mini-category-icon" title="Económico">${categoryIcon({ category: 'economico', categoryLabel: 'Económico' })}</div>
      </header>
      <section class="mini-action-body">
        <p class="mini-note">Funciona con la misma ventana del Tradeo Urbano. Tasa normal: 2:1 si el recurso que quieres está cerca o ya lo produces; 3:1 si no lo tienes cerca. Durante el primer año compensatorio, el Mercado funciona a 1:1.</p>
        ${sparseTradeRateNote(player, 'market')}
        <h3>1. Recurso que quieres recibir</h3>
        <div class="trade-receive-row">
          ${options.map(type => tradeReceiveButton(type, 'market', player)).join('')}
        </div>
        <h3>2. Recursos que entregas</h3>
        <div id="tradeGiveRows" class="trade-give-rows">
          ${options.map(type => tradeGiveRow(type, resources[type] || 0)).join('')}
        </div>
        <div id="tradeSummary" class="trade-summary">Elige el recurso que quieres. Cada botón muestra su tasa actual.</div>
        <div class="trade-action-row"><button class="create-button compact-confirm" onclick="executeMarketTrade('${tileId}')">Confirmar</button><button class="trade-open-button quick-trade-btn" title="Calcula una propuesta de pago; no confirma el canje" onclick="applyQuickTradeBalance()">Tradeo rápido</button></div>
        <button class="cancel-button" onclick="clearActionCard()">Cerrar</button>
      </section>
    </div>`;

  actionCard.onmouseenter = cancelActionCardHide;
  actionCard.onmouseleave = scheduleActionCardHide;
  refreshTradeSummary();
}

function setMarketReceive(type) {
  if (!currentTrade || currentTrade.mode !== 'market') return;
  setTradeReceive(type);
}

function changeMarketGive(type, delta) {
  if (!currentTrade || currentTrade.mode !== 'market') return;
  const resources = playerState[currentTrade.player].resources;
  const required = currentTrade.required || 3;
  const total = Object.values(currentTrade.give).reduce((sum, value) => sum + value, 0);
  const current = currentTrade.give[type] || 0;
  const maxAvailable = resources[type] || 0;
  if (delta > 0 && total >= required) return;
  const next = Math.max(0, Math.min(maxAvailable, current + delta));
  currentTrade.give[type] = next;
  const label = document.getElementById(`marketGive-${type}`);
  if (label) label.textContent = next;
  refreshMarketTradeSummary();
}

function refreshMarketTradeSummary() {
  refreshTradeSummary();
}

function executeMarketTrade(tileId) {
  if (!currentTrade || currentTrade.mode !== 'market' || currentTrade.tileId !== tileId) return;
  return executeUrbanTrade(tileId);
}

function renderActionCard(option, sourceCard, setupFree = false) {
  const owner = sourceCard.owner;
  const optionKind = option.id === 'initialVillager' ? 'villager' : option.id;
  const turnAllowed = setupFree || canCurrentPlayerActAs(owner);
  const limitBlocked = !setupFree && isConstructionLimitBlocked(owner, optionKind);
  const resourceBlocked = !setupFree && !canAfford(owner, option.cost || {});
  const canPay = turnAllowed && !limitBlocked && !resourceBlocked;
  const blockedText = !turnAllowed ? 'No es tu turno' : (limitBlocked ? limitMessageFor(optionKind, owner) : 'Recursos insuficientes');
  const costHtml = setupFree ? `<span class="text-cost">Gratis durante setup</span>` : resourceCostHtml(option.cost || {});
  const requirementText = optionKind === 'urban' ? `<h3>Requisitos</h3><p>${missingUrbanRequirement(owner) || 'Requisitos completos: tienes el Mercado y las 2 Casas necesarias.'}</p>` : '';
  const placementText = {
    villager: "Se coloca en una casilla con recurso dentro del dominio de un Asentamiento Urbano propio. Puedes apilar hasta 3 aldeanos propios en el mismo recurso.",
    initialVillager: "Se coloca en una casilla con recurso dentro del dominio del Asentamiento Urbano recién fundado.",
    house: "Se construye dentro del dominio de un Asentamiento Urbano propio. Puede construirse sobre una casilla con recurso o con aldeano. Esas fichas permanecen visibles encima del edificio.",
    market: "Se construye dentro del dominio de un Asentamiento Urbano propio. Puede construirse sobre una casilla con recurso o con aldeano. Esas fichas permanecen visibles encima del edificio.",
    urban: "Requiere 2 madera y 2 piedra. Debe colocarse en el segundo anillo externo fuera de la influencia urbana.",
    extraction: "Se construye sobre una casilla con recurso hasta dos anillos por fuera de la influencia de cualquier Asentamiento Urbano propio. No puede colocarse dentro del dominio urbano enemigo.",
    militaryComplex: "Se construye en el segundo anillo externo fuera de la influencia del Asentamiento Urbano.",
    militaryCamp: "Se construye en la segunda línea externa desde el Complejo Militar propio."
  }[option.id] || "Selecciona una casilla válida para crear esta ficha.";

  const category = actionCategoryForOption(optionKind);
  const subtitle = optionKind === 'villager' ? 'Unidad civil · Recolector' : category.label;
  actionCard.className = `mini-action-card ${ownerClass(owner)} action-card-overlay`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('${actionCardBackground(optionKind)}')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>${option.name}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="mini-category-icon" title="${category.label}">${categoryIcon({ category: category.key, categoryLabel: category.label })}</div>
      </header>
      <section class="mini-action-body">
        <div class="token-preview-row"><img class="token-preview" src="${option.icon}" alt="${option.name}" /><span>Ficha que se va a crear</span></div>
        <h3>Costo</h3>
        <div class="resource-row">${costHtml}</div>
        ${requirementText}
        <h3>Función</h3>
        <p>${option.effect || option.limitText || 'Opción de creación disponible.'}</p>
        <h3>Colocación</h3>
        <p>${placementText}</p>
        <button class="create-button" ${canPay ? '' : 'disabled'} onclick="beginPlacement('${option.id}', '${sourceCard.tileId}')">${canPay ? 'Crear / construir' : blockedText}</button>
        <button class="cancel-button" onclick="clearActionCard()">Cerrar</button>
      </section>
    </div>`;
  actionCard.onmouseenter = cancelActionCardHide;
  actionCard.onmouseleave = scheduleActionCardHide;
}

function actionCategoryForOption(type) {
  if (type === 'market' || type === 'extraction') return { key: 'economico', label: 'Edificio Económico' };
  if (type === 'militaryComplex' || type === 'militaryCamp') return { key: 'militar', label: 'Edificio Militar' };
  if (type === 'villager') return { key: 'civil', label: 'Unidad Civil' };
  return { key: 'civil', label: 'Edificio Civil' };
}

function renderOwnedCreatedCard(type, player, tileId, option = {}, canContinueCreation = false) {
  const kind = type === 'initialVillager' ? 'villager' : type;
  const name = {
    villager: 'Aldeano',
    house: 'Casa',
    market: 'Mercado',
    urban: 'Asentamiento Urbano',
    extraction: 'Base de Extracción',
    militaryComplex: 'Complejo Militar',
    militaryCamp: 'Campamento Militar'
  }[kind] || option.name || 'Ficha creada';

  const icon = kind === 'villager'
    ? villagerAsset(player)
    : kind === 'house'
      ? `assets/buildings/house-${player}.png`
      : kind === 'market'
        ? `assets/buildings/market-${player}.png`
        : kind === 'extraction'
          ? `assets/buildings/extraction-${player}.png`
          : kind === 'militaryComplex'
            ? `assets/buildings/military-complex-${player}.png`
            : kind === 'militaryCamp'
              ? `assets/buildings/military-camp-${player}.png`
              : `assets/buildings/urban-${player}.png`;

  const category = actionCategoryForOption(kind);
  const resource = placedUnits[tileId]?.gathers;
  const stackCount = placedUnits[tileId]?.count || 1;
  const extra = kind === 'villager' && resource
    ? `Recolectando ${resourceNames[resource]} en ${tileId}. Aldeanos en esta casilla: ${stackCount}/3.`
    : `Colocada en ${tileId}.`;

  actionCard.className = `mini-action-card ${ownerClass(player)} action-card-overlay`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('${actionCardBackground(kind)}')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>${name}</h2>
          <p>${category.label}</p>
        </div>
        <div class="mini-category-icon" title="${category.label}">${categoryIcon({ category: category.key, categoryLabel: category.label })}</div>
      </header>
      <section class="mini-action-body">
        <div class="token-preview-row"><img class="token-preview" src="${icon}" alt="${name}" /><span>Ficha creada</span></div>
        <h3>Estado</h3>
        <p>${extra}</p>
        ${canContinueCreation ? `<h3>Creación rápida</h3><p>Puedes crear otra ficha de este mismo tipo. Toca otra casilla iluminada y confirma <strong>Crear</strong>, o pulsa <strong>No crear</strong> para salir.</p>` : ''}
        <h3>Propietario</h3>
        <p>${ownerLabel(player)}</p>
        <button class="cancel-button" onclick="${canContinueCreation ? 'cancelCreationMode()' : 'clearActionCard()'}">${canContinueCreation ? 'No crear / salir' : 'Cerrar'}</button>
      </section>
    </div>`;
  actionCard.onmouseenter = cancelActionCardHide;
  actionCard.onmouseleave = scheduleActionCardHide;
}

function actionCardBackground(type) {
  if (type === 'house') return "assets/cards/casa-bg.png";
  if (type === 'market') return "assets/cards/mercado-bg.png";
  if (type === 'extraction') return "assets/cards/extraction-bg.png";
  if (type === 'militaryComplex') return "assets/cards/military-complex-bg.png";
  if (type === 'militaryCamp') return "assets/cards/military-camp-bg.png";
  return "assets/cards/asentamiento-urbano-bg.png";
}

function clearActionCard() {
  placementMode = null;
  placementConfirm = null;
  currentTrade = null;
  clearTimeout(actionCardHideTimer);
  actionCard.onmouseenter = null;
  actionCard.onmouseleave = null;
  actionCard.className = "mini-action-card empty-mini-card hidden-action-card";
  actionCard.innerHTML = `<div class="mini-card-content"><h2>Tarjeta de creación</h2><p>Haz clic en una opción del Asentamiento Urbano.</p><p class="mini-note">Aldeano, Casa, Mercado o expansión urbana.</p></div>`;
  drawBoard();
}

function canAfford(player, cost) {
  const resources = playerState[player].resources;
  return Object.entries(cost || {}).every(([type, amount]) => (resources[type] || 0) >= amount);
}

function payCost(player, cost) {
  if (!canAfford(player, cost)) return false;
  Object.entries(cost || {}).forEach(([type, amount]) => {
    playerState[player].resources[type] -= amount;
  });
  renderHud();
  return true;
}


function getMaxVillagers(player) {
  const state = playerState[player];
  return (state.buildings.urban || 0) * 3 + (state.buildings.house || 0) * 2;
}

function refreshPlayerCaps(player) {
  playerState[player].maxVillagers = getMaxVillagers(player);
}

function getConstructionLimit(player, type) {
  const state = playerState[player];
  if (type === 'villager' || type === 'initialVillager') return getMaxVillagers(player);
  if (type === 'house') return (state.buildings.urban || 0) >= 2 ? 3 : (state.buildings.urban || 0);
  if (type === 'market') return (state.buildings.urban || 0) >= 2 ? 2 : (state.buildings.urban || 0);
  if (type === 'extraction') return (state.buildings.urban || 0) >= 2 ? 2 : 0;
  if (type === 'militaryComplex') return (state.buildings.urban || 0) >= 2 ? 1 : 0;
  if (type === 'militaryCamp') return (state.buildings.urban || 0) >= 2 && (state.buildings.militaryComplex || 0) >= 1 ? 1 : 0;
  if (type === 'urban') return 99;
  return 99;
}

function countPlacedVillagers(player) {
  return Object.values(placedUnits).reduce((total, unit) => {
    if (!unit || unit.type !== 'villager' || unit.owner !== player) return total;
    return total + (unit.count || 1);
  }, 0);
}

function getActiveVillagerTotal(player) {
  return Math.max(playerState[player]?.units?.villager || 0, countPlacedVillagers(player));
}

function getConstructionUsed(player, type) {
  const state = playerState[player];
  if (type === 'villager' || type === 'initialVillager') return getActiveVillagerTotal(player);
  const pending = getPendingCount(player, 'buildings', type);
  if (type === 'house') return (state.buildings.house || 0) + pending;
  if (type === 'market') return (state.buildings.market || 0) + pending;
  if (type === 'extraction') return (state.buildings.extraction || 0) + pending;
  if (type === 'militaryComplex') return (state.buildings.militaryComplex || 0) + pending;
  if (type === 'militaryCamp') return (state.buildings.militaryCamp || 0) + pending;
  if (type === 'urban') return (state.buildings.urban || 0) + pending;
  return pending;
}

function canUnlockNextUrban(player) {
  const state = playerState[player];
  const urban = state.buildings.urban || 0;
  if (urban <= 0) return false;
  if (getPendingCount(player, 'buildings', 'urban') > 0) return false;
  if (urban < 2) {
    return (state.buildings.market || 0) >= urban && (state.buildings.house || 0) >= urban && getActiveVillagerTotal(player) >= (urban * 2);
  }
  return (state.buildings.extraction || 0) >= 1
    && (state.buildings.militaryComplex || 0) >= 1
    && (state.buildings.militaryCamp || 0) >= 1
    && countNeutralDominions(player) >= 2;
}

function missingUrbanRequirement(player) {
  const state = playerState[player];
  const urban = state.buildings.urban || 0;
  if (getPendingCount(player, 'buildings', 'urban') > 0) return 'Ya hay un Asentamiento Urbano en construcción. Debe activarse antes de iniciar otro.';
  if (urban < 2) {
    const neededMarkets = Math.max(0, urban - (state.buildings.market || 0));
    const neededHouses = Math.max(0, urban - (state.buildings.house || 0));
    const neededVillagers = Math.max(0, (urban * 2) - getActiveVillagerTotal(player));
    if (neededMarkets || neededHouses || neededVillagers) {
      const parts = [];
      if (neededMarkets) parts.push(`${neededMarkets} Mercado${neededMarkets > 1 ? 's' : ''}`);
      if (neededHouses) parts.push(`${neededHouses} Casa${neededHouses > 1 ? 's' : ''}`);
      if (neededVillagers) parts.push(`${neededVillagers} Aldeano${neededVillagers > 1 ? 's' : ''}`);
      return `Requisitos insuficientes: falta ${parts.join(' y ')}.`;
    }
    return '';
  }

  const parts = [];
  if ((state.buildings.extraction || 0) < 1) parts.push('1 Base de Extracción activa');
  if ((state.buildings.militaryComplex || 0) < 1) parts.push('1 Complejo Militar activo');
  if ((state.buildings.militaryCamp || 0) < 1) parts.push('1 Campamento Militar activo');
  const neutralNeeded = Math.max(0, 2 - countNeutralDominions(player));
  if (neutralNeeded) parts.push(`${neutralNeeded} asentamiento${neutralNeeded > 1 ? 's' : ''} neutral${neutralNeeded > 1 ? 'es' : ''} dominado${neutralNeeded > 1 ? 's' : ''}`);
  return parts.length ? `Para el siguiente Asentamiento Urbano falta: ${parts.join(', ')}.` : '';
}

function getConstructionRemaining(player, type) {
  if (type === 'urban') return canUnlockNextUrban(player) ? 1 : 0;
  return Math.max(0, getConstructionLimit(player, type) - getConstructionUsed(player, type));
}

function isConstructionLimitBlocked(player, type) {
  if (type === 'initialVillager') return false;
  if (type === 'urban') return !canUnlockNextUrban(player);
  return getConstructionRemaining(player, type) <= 0;
}

function limitMessageFor(type, player = currentPlayer) {
  if (type === 'villager') {
    const houseRemaining = getConstructionRemaining(player, 'house');
    if (houseRemaining > 0) return 'Necesitas otra Casa para crear más aldeanos.';
    return 'Necesitas otro Asentamiento Urbano para ampliar tu capacidad de aldeanos.';
  }
  if (type === 'house') return 'Necesitas otro Asentamiento Urbano para construir más casas.';
  if (type === 'market') return 'Necesitas el segundo Asentamiento Urbano para construir otro Mercado.';
  if (type === 'extraction') return 'Necesitas segundo Asentamiento Urbano y máximo 2 Bases de Extracción.';
  if (type === 'militaryComplex') return 'Necesitas segundo Asentamiento Urbano y máximo 1 Complejo Militar.';
  if (type === 'militaryCamp') return (playerState[player]?.buildings?.militaryComplex || 0) < 1 ? 'Necesitas construir y activar primero un Complejo Militar.' : 'Necesitas segundo Asentamiento Urbano y máximo 1 Campamento Militar.';
  if (type === 'urban') return missingUrbanRequirement(player) || 'Recursos insuficientes para construir otro Asentamiento Urbano.';
  return 'Necesitas otro Asentamiento Urbano.';
}

function creationOptionBadge(option, player) {
  const type = option.id === 'initialVillager' ? 'villager' : option.id;
  if (!['villager','house','market','urban','extraction','militaryComplex','militaryCamp'].includes(type)) return '';
  const remaining = getConstructionRemaining(player, type);
  const label = type === 'urban' ? '+' : remaining;
  const exhausted = type !== 'urban' && remaining <= 0 ? ' exhausted' : '';
  return `<span class="creation-count-badge${exhausted}">${label}</span>`;
}

function beginPlacement(type, sourceTileId, options = {}) {
  const sourceCard = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId];
  if (!sourceCard) return;
  placementConfirm = null;

  if (sourceCard.isPlayerBuilt && !isCardOperational(sourceCard)) {
    addLog('Este edificio todavía está en preparación y no puede crear ni interactuar.', 'warn');
    renderBuildingCard(sourceTileId);
    return;
  }

  if (!canCurrentPlayerActAs(sourceCard.owner) && type !== 'initialVillager') {
    addLog(turnLockedMessage(sourceCard.owner), 'warn');
    renderBuildingCard(sourceTileId);
    return;
  }

  if (type === 'initialVillager' && placementMode?.setupPlacement) {
    actionCard.classList.add('hidden-action-card');
    addLog(`Selecciona una casilla válida para colocar el Aldeano inicial.`, sourceCard.owner);
    drawBoard();
    return;
  }

  const option = sourceCard.creationOptions?.find(o => o.id === type);
  if (!option || option.locked) return;

  if (isConstructionLimitBlocked(sourceCard.owner, type)) {
    renderActionCard(option, sourceCard);
    addLog(limitMessageFor(type, sourceCard.owner), "warn");
    return;
  }

  if (!canAfford(sourceCard.owner, option.cost || {})) {
    renderActionCard(option, sourceCard);
    return;
  }

  placementMode = {
    type,
    sourceTileId,
    player: sourceCard.owner,
    cost: { ...(option.cost || {}) },
    option
  };

  if (options.keepActionCardVisible) {
    actionCard.classList.remove('hidden-action-card');
  } else {
    renderActionCard(option, sourceCard);
  }
  if (!options.silent) addLog(`Selecciona una casilla válida para colocar: ${option.name}.`, sourceCard.owner);
  drawBoard();
}


function villagerStackInfo(tileId) {
  const unit = placedUnits[tileId];
  if (!unit) return { count: 0, owner: null, type: null };
  return {
    count: unit.count || 1,
    owner: unit.owner || null,
    type: unit.type || null
  };
}

function canAddVillagerToTile(tileId, player) {
  const stack = villagerStackInfo(tileId);
  if (!resourceAssignments[tileId]) return false;
  const cell = getCellById(tileId);
  const hasExtraction = !!(cell?.special?.kind === 'extraction' && playerBuildingCards[tileId]?.owner === player && isCardOperational(playerBuildingCards[tileId]));
  const inUrbanDomain = isInAnyOwnedUrbanRadius(player, tileId, 1);
  if (!hasExtraction && !inUrbanDomain && placementMode?.type !== 'initialVillager') return false;
  if (stack.count <= 0) return true;
  return stack.type === 'villager' && stack.owner === player && stack.count < 3;
}

function validPlacementTilesFor(mode) {
  if (!mode) return [];

  let domain = new Set();
  if (isConstructionLimitBlocked(mode.player, mode.type)) return [];

  const ownedUrbanIds = Object.values(playerBuildingCards)
    .filter(card => isUrbanSettlementCard(card) && card.owner === mode.player)
    .map(card => card.tileId);
  const operationalUrbanIds = Object.values(playerBuildingCards)
    .filter(card => isUrbanSettlementCard(card) && card.owner === mode.player && isCardOperational(card))
    .map(card => card.tileId);

  if (mode.type === 'initialVillager') {
    getCellsWithinRadius(mode.sourceTileId, 1).forEach(cellId => domain.add(cellId));
  } else if (mode.type === 'extraction') {
    operationalUrbanIds.forEach(id => {
      getCellsWithinRadius(id, 3).forEach(cellId => domain.add(cellId));
      getCellsWithinRadius(id, 1).forEach(cellId => domain.delete(cellId));
    });
  } else if (mode.type === 'urban') {
    // Los nuevos Asentamientos Urbanos se pueden construir en anillo 1 o 2
    // alrededor de un Asentamiento Urbano propio activo. No solo en el tercer anillo.
    operationalUrbanIds.forEach(id => {
      getCellsAtDistance(id, 1).forEach(cellId => domain.add(cellId));
      getCellsAtDistance(id, 2).forEach(cellId => domain.add(cellId));
    });
  } else if (mode.type === 'militaryComplex') {
    operationalUrbanIds.forEach(id => getCellsWithinRadius(id, 3).forEach(cellId => domain.add(cellId)));
  } else if (mode.type === 'militaryCamp') {
    Object.values(playerBuildingCards)
      .filter(card => card.owner === mode.player && card.buildingKind === 'militaryComplex')
      .forEach(card => getCellsAtDistance(card.tileId, 2).forEach(cellId => domain.add(cellId)));
  } else if (mode.type === 'market') {
    // El Mercado creado desde un Asentamiento Urbano debe usar como referencia
    // ese Asentamiento Urbano específico, no todos los dominios ni el área del Daimio.
    // Antes se mezclaba el radio diplomático y por eso la zona verde salía corrida.
    const sourceCard = playerBuildingCards[mode.sourceTileId] || buildingCards[mode.sourceTileId];
    if (sourceCard && isUrbanSettlementCard(sourceCard)) {
      getCellsWithinRadius(mode.sourceTileId, 1).forEach(cellId => domain.add(cellId));
    } else {
      operationalUrbanIds.forEach(id => getCellsWithinRadius(id, 1).forEach(cellId => domain.add(cellId)));
    }
  } else {
    // Solo los Asentamientos Urbanos activos expanden zona de creación.
    // Un Asentamiento Urbano en espera no debe permitir aldeanos ni edificios alrededor todavía.
    operationalUrbanIds.forEach(id => getCellsWithinRadius(id, 1).forEach(cellId => domain.add(cellId)));
    Object.values(playerBuildingCards)
      .filter(card => card.owner === mode.player && card.buildingKind === 'extraction' && isCardOperational(card))
      .forEach(card => domain.add(card.tileId));
  }

  return cells.filter(cell => {
    if (!domain.has(cell.id)) return false;

    if (mode.type === 'villager' || mode.type === 'initialVillager') {
      // Puede haber hasta 3 aldeanos propios sobre el mismo recurso.
      // No se permite mezclar aldeanos enemigos en la misma casilla.
      if (!canAddVillagerToTile(cell.id, mode.player)) return false;
      if (getConstructionRemaining(mode.player, mode.type === 'initialVillager' ? 'villager' : mode.type) <= 0 && mode.type !== 'initialVillager') return false;
      return true;
    }

    // Casa/Mercado sí pueden construirse sobre recurso o aldeano.
    // Solo bloquea otro edificio existente.
    if (cell.special) return false;
    if (mode.type === 'house' || mode.type === 'market') return true;

    if (mode.type === 'extraction') {
      if (isInEnemyUrbanRadius(mode.player, cell.id, 1)) return false;
      return !!resourceAssignments[cell.id] && !cell.special;
    }

    if (mode.type === 'militaryComplex') {
      if (isInEnemyUrbanRadius(mode.player, cell.id, 2)) return false;
      return !cell.special;
    }

    if (mode.type === 'militaryCamp') {
      return !cell.special;
    }

    if (mode.type === 'urban') {
      return !cell.special && hasUrbanDistance(cell.id, mode.player);
    }

    return false;
  }).map(cell => cell.id);
}

function isValidPlacementTile(tileId) {
  return validPlacementTilesFor(placementMode).includes(tileId);
}

function placeCreatedThing(tileId, options = {}) {
  if (!placementMode || !isValidPlacementTile(tileId)) return false;
  const { type, player, cost } = placementMode;
  const setupPlacement = !!placementMode.setupPlacement;
  const option = placementMode.option;
  placementConfirm = null;
  if (!payCost(player, cost)) return false;
  const cell = getCellById(tileId);

  if (type === 'villager' || type === 'initialVillager') {
    const existingStack = placedUnits[tileId];
    if (existingStack && existingStack.type === 'villager' && existingStack.owner === player) {
      existingStack.count = Math.min(3, (existingStack.count || 1) + 1);
      existingStack.gathers = existingStack.gathers || resourceAssignments[tileId] || null;
      existingStack.pendingActivations = existingStack.pendingActivations || [];
    } else {
      placedUnits[tileId] = { type: 'villager', owner: player, count: 1, gathers: resourceAssignments[tileId] || null, pendingActivations: [] };
    }

    if (type === 'initialVillager') {
      if (player === setupState.firstChooser) setupState.firstVillagerTile = tileId;
      if (player === setupState.secondChooser) setupState.secondVillagerTile = tileId;
    }
    // v1.0.5: el Aldeano queda activo de inmediato. No se registra espera ni reloj de arena.
    const totalCount = placedUnits[tileId].count || 1;
    const stackText = totalCount > 1 ? ` Total visible en esta casilla: ${totalCount}.` : '';
    addLog(`${playerState[player].name} coloca un Aldeano en ${tileId}${resourceAssignments[tileId] ? ` para recolectar ${resourceNames[resourceAssignments[tileId]]}.` : '.'}${stackText}`, player);
  }

  if (type === 'house') {
    cell.special = { kind: 'house', name: player === 'blue' ? 'Casa Azul' : 'Casa Roja', description: 'Vivienda civil construida por el jugador.' };
    playerBuildingCards[tileId] = createBuiltCard(tileId, player, 'house');
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('house');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'house', 1);
    registerActivation({ kind: 'building', player, type: 'house', tileId, remaining: pendingDelayForPlacement('house'), label: 'Casa' });
    addLog(`${playerState[player].name} construye una Casa en ${tileId}. Estará activa en 1 cambio de estación.`, player);
  }

  if (type === 'market') {
    cell.special = { kind: 'market', name: player === 'blue' ? 'Mercado Azul' : 'Mercado Rojo', description: 'Mercado construido por el jugador.' };
    playerBuildingCards[tileId] = createBuiltCard(tileId, player, 'market');
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('market');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'market', 1);
    registerActivation({ kind: 'building', player, type: 'market', tileId, remaining: pendingDelayForPlacement('market'), label: 'Mercado' });
    addLog(`${playerState[player].name} construye un Mercado en ${tileId}. Estará activo en 1 cambio de estación.`, player);
  }

  if (type === 'extraction') {
    cell.special = { kind: 'extraction', name: player === 'blue' ? 'Base de Extracción Azul' : 'Base de Extracción Roja', description: 'Base de extracción de recursos construida por el jugador.' };
    playerBuildingCards[tileId] = createBuiltCard(tileId, player, 'extraction');
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('extraction');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'extraction', 1);
    registerActivation({ kind: 'building', player, type: 'extraction', tileId, remaining: pendingDelayForPlacement('extraction'), label: 'Base de Extracción' });
    addLog(`${playerState[player].name} construye una Base de Extracción en ${tileId}. Permitirá aldeanos fuera del dominio urbano.`, player);
  }

  if (type === 'militaryComplex') {
    cell.special = { kind: 'militaryComplex', name: player === 'blue' ? 'Complejo Militar Azul' : 'Complejo Militar Rojo', description: 'Complejo militar construido por el jugador.' };
    playerBuildingCards[tileId] = createBuiltCard(tileId, player, 'militaryComplex');
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('militaryComplex');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'militaryComplex', 1);
    registerActivation({ kind: 'building', player, type: 'militaryComplex', tileId, remaining: pendingDelayForPlacement('militaryComplex'), label: 'Complejo Militar' });
    addLog(`${playerState[player].name} construye un Complejo Militar en ${tileId}.`, player);
  }

  if (type === 'militaryCamp') {
    cell.special = { kind: 'militaryCamp', name: player === 'blue' ? 'Campamento Militar Azul' : 'Campamento Militar Rojo', description: 'Campamento militar construido por el jugador.' };
    playerBuildingCards[tileId] = createBuiltCard(tileId, player, 'militaryCamp');
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('militaryCamp');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'militaryCamp', 1);
    registerActivation({ kind: 'building', player, type: 'militaryCamp', tileId, remaining: pendingDelayForPlacement('militaryCamp'), label: 'Campamento Militar' });
    addLog(`${playerState[player].name} construye un Campamento Militar en ${tileId}. Capacidad: 500 unidades.`, player);
  }

  if (type === 'urban') {
    cell.special = { kind: 'urban', name: player === 'blue' ? 'Asentamiento Urbano Azul' : 'Asentamiento Urbano Rojo', description: 'Nuevo centro urbano construido por el jugador.' };
    playerBuildingCards[tileId] = createUrbanSettlementCard(tileId, player);
    playerBuildingCards[tileId].pendingSeasons = pendingDelayForPlacement('urban');
    builtSpecialTiles.add(tileId);
    addPendingCount(player, 'buildings', 'urban', 1);
    registerActivation({ kind: 'building', player, type: 'urban', tileId, remaining: pendingDelayForPlacement('urban'), label: 'Asentamiento Urbano' });
    addLog(`${playerState[player].name} construye un nuevo Asentamiento Urbano en ${tileId}. Estará activo en 2 cambios de estación; mientras tanto no habilita zona de creación.`, player);
    updateUrbanCreationOptions(player);
  }

  const sourceTileId = placementMode.sourceTileId;
  const shouldContinueCreationMode = options.continueCreationMode && quickCreatableTypes.includes(type) && !setupPlacement;
  let nextPlacementMode = null;

  if (shouldContinueCreationMode) {
    const sourceCard = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId];
    const canCreateMore = sourceCard
      && isCardOperational(sourceCard)
      && canCurrentPlayerActAs(player)
      && !isConstructionLimitBlocked(player, type)
      && canAfford(player, option.cost || {});
    if (canCreateMore) {
      const candidateMode = {
        type,
        sourceTileId,
        player,
        cost: { ...(option.cost || {}) },
        option
      };
      if (validPlacementTilesFor(candidateMode).length > 0) nextPlacementMode = candidateMode;
    }
  }

  placementMode = nextPlacementMode;
  renderHud();
  drawBoard();

  if (sourceTileId && (playerBuildingCards[sourceTileId] || buildingCards[sourceTileId])) {
    selectedId = sourceTileId;
    document.querySelectorAll('.hex-group').forEach(group => { group.classList.toggle('selected', group.dataset.id === sourceTileId); });
    const sourceCell = getCellById(sourceTileId);
    renderTileInfoForCell(sourceCell);
    renderBuildingCard(sourceTileId);
    const sourceCard = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId];
    showInfluence(sourceTileId, sourceCard?.influenceRadius || 1, sourceCard?.owner || player);
  } else {
    selectCell(tileId);
  }

  renderOwnedCreatedCard(type === 'initialVillager' ? 'villager' : type, player, tileId, option, !!nextPlacementMode);

  if (setupPlacement) {
    finishInitialVillagerPlacement(player);
  }

  return true;
}

function confirmPlacement(tileId) {
  if (!placementMode) return false;
  if (!placementConfirm || placementConfirm.tileId !== tileId) return false;
  return placeCreatedThing(tileId, { continueCreationMode: true });
}

function cancelPlacementConfirm() {
  placementConfirm = null;
  drawBoard();
}

function cancelCreationMode() {
  placementMode = null;
  placementConfirm = null;
  clearActionCard();
}

function confirmVillagerPlacement(tileId) { return confirmPlacement(tileId); }
function cancelVillagerPlacementConfirm() { return cancelPlacementConfirm(); }
function cancelVillagerCreationMode() { return cancelCreationMode(); }

function createBuiltCard(tileId, player, type) {
  const label = player === 'blue' ? 'Azul' : 'Rojo';
  const common = { tileId, owner: player, isPlayerBuilt: true, annualBenefit: {}, annualContractTax: {}, influenceRadius: 0 };
  if (type === 'house') {
    return { ...common, id: `casa-${player}-${tileId}`, name: `Casa ${label}`, category: "civil", categoryLabel: "Edificio Civil · Casa", background: "assets/cards/casa-bg.png", acquisitionCost: { wood: 2 }, reconstructionCost: { wood: 2 }, annualMaintenanceCost: { wood: 1 }, buildingKind: "house", houseCapacity: 2 };
  }
  if (type === 'market') {
    return { ...common, id: `mercado-${player}-${tileId}`, name: `Mercado ${label}`, category: "economico", categoryLabel: "Edificio Civil · Mercado", background: "assets/cards/mercado-bg.png", acquisitionCost: { wood: 3, stone: 2, gold: 1 }, reconstructionCost: { wood: 3, stone: 2, gold: 1 }, annualMaintenanceCost: { wood: 1 }, buildingKind: "market", exchangeRate: "2:1" };
  }
  if (type === 'extraction') {
    return { ...common, id: `extraccion-${player}-${tileId}`, name: `Base de Extracción ${label}`, category: "economico", categoryLabel: "Edificio Económico · Base de Extracción", background: "assets/cards/extraction-bg.png", acquisitionCost: { wood: 3, stone: 2, gold: 1 }, reconstructionCost: { wood: 3, stone: 2, gold: 1 }, annualMaintenanceCost: { wood: 1 }, buildingKind: "extraction", transportDelay: extractionDelayForTile(player, tileId) };
  }
  if (type === 'militaryComplex') {
    return { ...common, id: `complejo-militar-${player}-${tileId}`, name: `Complejo Militar ${label}`, category: "militar", categoryLabel: "Edificio Militar · Complejo Militar", background: "assets/cards/military-complex-bg.png", acquisitionCost: { wood: 3, stone: 2, metal: 1 }, reconstructionCost: { wood: 3, stone: 2, metal: 1 }, annualMaintenanceCost: { wood: 1, metal: 1 }, buildingKind: "militaryComplex", influenceRadius: 1, unlockedUnits: ['archer','samurai','yariMonk'] };
  }
  if (type === 'militaryCamp') {
    return { ...common, id: `campamento-militar-${player}-${tileId}`, name: `Campamento Militar ${label}`, category: "militar", categoryLabel: "Edificio Militar · Campamento Militar", background: "assets/cards/military-camp-bg.png", acquisitionCost: { wood: 3, food: 1 }, reconstructionCost: { wood: 3, food: 1 }, annualMaintenanceCost: { food: 1 }, buildingKind: "militaryCamp", unitCapacity: 500 };
  }
  return { ...common, id: `edificio-${player}-${tileId}`, name: `Edificio ${label}`, category: "civil", categoryLabel: "Edificio", background: "assets/cards/asentamiento-urbano-bg.png", acquisitionCost: {}, reconstructionCost: {}, annualMaintenanceCost: {}, buildingKind: type };
}


function applyCommercialResourceBias(candidates) {
  const commercialIds = Object.keys(buildingCards).filter(id => isCommercialCard(buildingCards[id]));
  const scored = candidates.map(cell => {
    let score = 0;
    commercialIds.forEach(id => {
      const radius2 = getCellsWithinRadius(id, 2);
      const radius1 = getCellsWithinRadius(id, 1);
      if (radius2.includes(cell.id)) score += 4;
      if (radius1.includes(cell.id)) score += 2;
    });
    score += Math.random();
    return { cell, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map(item => item.cell);
}

function showInfluence(tileId, radius, owner) {
  clearInfluence();
  const cls = owner === 'blue' ? 'influence-blue' : owner === 'red' ? 'influence-red' : 'influence-neutral';
  getCellsWithinRadius(tileId, radius).forEach(id => {
    const group = document.querySelector(`.hex-group[data-id="${id}"]`);
    if (group) group.classList.add(cls);
  });
}

function setBuildingOwner(tileId, owner) {
  const card = playerBuildingCards[tileId] || buildingCards[tileId];
  if (!card) return;
  card.owner = owner;
  renderBuildingCard(tileId);
  drawBoard();
  selectCell(tileId);
  showInfluence(tileId, card.influenceRadius, card.owner);
}

function renderBuildingCard(tileId) {
  const card = playerBuildingCards[tileId] || buildingCards[tileId];
  if (!card) {
    buildingCard.className = 'building-info-card empty-card';
    buildingCard.innerHTML = `<div class="empty-card-content"><h2>Edificio sin carta detallada</h2><p>Esta casilla especial todavía no tiene tarjeta completa.</p><p class="mini-note">Ahora mismo hay tarjetas completas para puertos, asentamientos comerciales y puestos de exploración.</p></div>`;
    return;
  }

  if (isUrbanSettlementCard(card)) card.creationOptions = urbanCreationOptionsFor(card.owner);
  buildingCard.className = `building-info-card ${ownerClass(card.owner)}`;

  const acquisitionBlock = Object.keys(card.acquisitionCost || {}).length
    ? `<div class="cost-block">
            <span class="cost-label">Costo de adquisición</span>
            <div class="resource-row">${resourceCostHtml(card.acquisitionCost)}</div>
       </div>`
    : isUrbanSettlementCard(card)
      ? `<div class="cost-block">
            <span class="cost-label">Estado inicial</span>
            <div class="resource-row text-cost">Centro civil del jugador</div>
         </div>`
      : isTempleCard(card)
        ? `<div class="cost-block">
              <span class="cost-label">Condición de consagración</span>
              <div class="resource-row text-cost">Influencia + presencia militar</div>
           </div>`
        : `<div class="cost-block">
              <span class="cost-label">Condición de control</span>
              <div class="resource-row text-cost">Presencia militar circundante</div>
           </div>`;

  const annualTaxBlock = Object.keys(card.annualMaintenanceCost || card.annualContractTax || {}).length
    ? `<div class="cost-block">
            <span class="cost-label">${card.annualMaintenanceCost ? 'Impuesto anual' : 'Impuesto anual por contrato'}</span>
            <div class="resource-row">${resourceCostHtml(card.annualMaintenanceCost || card.annualContractTax)}</div>
       </div>`
    : '';

  const commonCostBlocks = `
        <div class="cost-grid">
          ${acquisitionBlock}
          <div class="cost-block">
            <span class="cost-label">Costo de reconstrucción</span>
            <div class="resource-row">
              ${resourceCostHtml(card.reconstructionCost)}
            </div>
          </div>
          ${annualTaxBlock}
        </div>`;

  let benefitsHtml = '';
  let extraControls = '';
  const pendingNotice = card.pendingSeasons && card.pendingSeasons > 0 ? `<div class="locked-interaction-note">⏳ En preparación: este edificio estará activo en ${card.pendingSeasons} cambio${card.pendingSeasons > 1 ? 's' : ''} de estación.</div>` : '';
  const interactionLocked = !canInteractWithFixedBuilding(card);

  if (isPortCard(card)) {
    const monopolyStatus = monopolyOwnerLabel(card);
    const contractDisabled = card.monopolyOwner ? 'disabled' : '';
    const monopolyResource = monopolyResourceLabel(card);

    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Comercio Marítimo:</strong> el jugador que construya en su dominio paga al propietario el beneficio anual.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Beneficio anual:</strong> <span class="benefit-text-line">${annualBenefitHtml(card)}</span> durante el Cambio de Año.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>
            <span class="maritime-block">
              <span class="maritime-title"><strong>Conexión Marítima:</strong> monopolio de ${monopolyResource}.</span>
              <span class="maritime-cost"><strong>Contrato:</strong> ${resourcePips('gold', card.maritimeContractCost.gold)}.</span>
              <span class="maritime-effect">La tasa de canje de ${monopolyResource} cambia para medios que no sean extracción directa: el dueño del monopolio recibe ${inlineResourceDelta(card.monopolyResource, 1)} cuando un edificio o beneficio entregue ese recurso; los demás jugadores reciben ${inlineResourceDelta(card.monopolyResource, -1)} en esos mismos casos.</span>
              <span class="maritime-state"><strong>Estado:</strong> ${monopolyStatus}.</span>
            </span>
          </span></div>`;

    const contractLabel = card.monopolyOwner ? 'Conexión marítima contratada' : 'Contratar conexión marítima';
    const ownedByTurnPlayer = card.owner === currentPlayer;
    extraControls = interactionLocked
      ? `<div class="locked-interaction-note">${neutralInteractionRequirement(card)}</div>
        <div class="contract-controls disabled-controls" aria-label="Contrato marítimo bloqueado">
          <button class="blue-btn" disabled>Contratar conexión marítima</button><span class="mini-note">No puedes contratarla todavía: primero adquiere/controla el Puerto con el Daimio.</span>
        </div>`
      : `<div class="contract-controls" aria-label="Contrato marítimo">
          <button class="blue-btn" ${contractDisabled || !ownedByTurnPlayer ? 'disabled' : ''} onclick="contractMaritime('${tileId}', currentPlayer)">${contractLabel}</button>
          ${!ownedByTurnPlayer && !card.monopolyOwner ? `<span class="mini-note">Solo el dueño del Puerto puede contratar esta Conexión Marítima.</span>` : ''}
        </div>`;
  }

  if (isCommercialSettlementCard(card)) {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Peaje de Caminos:</strong> el jugador que construya en su dominio paga al propietario el beneficio anual.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Beneficio anual:</strong> <span class="benefit-text-line">${annualBenefitHtml(card)}</span> durante el Cambio de Año.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>
            <span class="maritime-block">
              <span class="maritime-title"><strong>Comprar Carta de Comercio:</strong> permite comprar 1 Carta de Comercio.</span>
              <span class="maritime-cost"><strong>Costo alto:</strong> ${resourceCostHtml(card.tradeCardCost)}.</span>
              <span class="maritime-effect">Este beneficio representa contratos, rutas, intercambios y ventajas económicas que no se obtienen desde los puertos.</span>
            </span>
          </span></div>`;
  }

  if (isExplorationPostCard(card)) {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Control por presencia militar:</strong> no se compra. Se controla si tienes un escuadrón propio en una casilla circundante y no hay enemigos disputando.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Recursos base:</strong> <span class="benefit-text-line">${baseResourceHtml(card.baseResources)}</span> durante el Cambio de Año.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Hallazgo de metales:</strong> ${Math.round(card.metalChance * 100)}% de probabilidad de obtener ${inlineResource('metal', 1)} adicional.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Carta Táctica:</strong> ${Math.round(card.tacticCardChance * 100)}% de probabilidad de recibir 1 Carta Táctica en lugar de recursos.</span></div>`;
  }

  if (isTempleCard(card)) {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>
            <span class="maritime-block">
              <span class="maritime-title"><strong>Consagración:</strong> requiere 2 Asentamientos Urbanos, 1 Puerto o Puesto Comercial, 1 escuadrón propio circundante y ninguna disputa enemiga.</span>
              <span class="maritime-effect">El templo no se compra con recursos: se activa por influencia durante el Cambio de Año.</span>
            </span>
          </span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Unidad desbloqueada:</strong> <button class="trade-open-button" onclick="openUnitInfo('yariMonk', currentPlayer)">${card.unlocksUnit.name}</button> (${card.unlocksUnit.category}). Carta informativa disponible; creación futura por Templo/Monasterio.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Creación futura:</strong> el Monje con Yari se vincula al Templo/Monasterio. Por ahora solo se muestra su carta de información.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Alivio espiritual:</strong> durante el Cambio de Año puede reducir ${card.templeRelief.debtReduction} Deuda General o aliviar ${card.templeRelief.taxRelief} impuesto.</span></div>`;
  }

  if (card.buildingKind === 'house') {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Vivienda:</strong> aumenta la capacidad de aldeanos del jugador en ${card.houseCapacity}.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Uso:</strong> permite sostener más trabajadores civiles dentro del dominio urbano.</span></div>`;
  }

  if (card.buildingKind === 'market') {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Canje básico:</strong> permite intercambiar recursos con tasa ${card.exchangeRate}.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Economía:</strong> este edificio será la base para mejoras de comercio y conversiones más eficientes.</span></div>`;
  }

  if (card.buildingKind === 'house') {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Vivienda:</strong> aumenta en +2 la capacidad máxima de aldeanos del jugador.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Impuesto anual:</strong> ${resourceCostHtml(card.annualMaintenanceCost)} durante el Cambio de Año.</span></div>`;
  }

  if (card.buildingKind === 'market') {
    const canNetwork = (playerState[card.owner]?.buildings?.market || 0) >= 2;
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Mercado dinámico:</strong> cambia recursos por otro recurso elegido. Si produces el recurso objetivo con aldeanos, la tasa es 2:1. Si no lo produces, la tasa sube a 3:1. Durante el primer año compensatorio, el Mercado tiene tasa 1:1 para todos los recursos.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Red de Mercados:</strong> ${canNetwork ? 'activa. Puedes pagar 1 Oro para mejorar en -1 el índice de cambio de un recurso y recibes 2 recursos anuales extra por cada Mercado.' : 'requiere 2 Mercados activos.'}</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Impuesto anual:</strong> ${resourceCostHtml(card.annualMaintenanceCost)} durante el Cambio de Año.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><button class="trade-open-button" onclick="openMarketTrade('${tileId}')">Abrir mercado dinámico</button> ${canNetwork ? `<button class="trade-open-button" onclick="improveMarketRate('${card.owner}')">Mejorar índice -1 por 1 Oro</button>` : ''}</span></div>`;
  }

  if (card.buildingKind === 'extraction') {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Extracción lejana:</strong> permite colocar aldeanos sobre este recurso fuera del dominio urbano.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Transporte:</strong> los recursos tardan ${card.transportDelay || 1} turno${(card.transportDelay || 1) > 1 ? 's' : ''} en llegar.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Recurso local:</strong> ${resourceAssignments[tileId] ? inlineResource(resourceAssignments[tileId], 1) : 'sin recurso'}.</span></div>`;
  }

  if (card.buildingKind === 'militaryComplex') {
    const unitOptions = militaryCreationOptionsForBuilding(card);
    const campReady = hasActiveMilitaryCamp(card.owner);
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Dominio militar:</strong> influencia militar de radio 1 alrededor del complejo. No puede construirse dentro de radio 2 de un Asentamiento Urbano enemigo.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Cadena militar:</strong> primero construyes el Complejo Militar, luego activas un Campamento Militar, y después puedes desplegar tropas.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Creación de unidades militares:</strong> permite crear unidades para dominar puestos, proteger edificios y preparar combate.${campReady ? '' : '<br><em>Bloqueado: falta un Campamento Militar activo.</em>'}</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Capacidad de creación:</strong>${isCardOperational(card) ? `<div class="creation-grid">${unitOptions.map(option => renderMilitaryCreationOption(option, card.owner, tileId)).join('')}<button class="creation-option" onclick="renderMilitaryUnitInfoCard('yariMonk','${card.owner}','${tileId}')"><span class="creation-token-wrap"><img src="${unitTokenAsset('yariMonk', card.owner)}" alt="Monje con Yari" /></span><span><strong>Monje con Yari</strong><small>Carta informativa. Creación futura por Templo/Monasterio.</small></span></button></div>` : ' ⏳ Este complejo todavía no puede crear unidades.'}</span></div>`;
  }

  if (card.buildingKind === 'militaryCamp') {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Capacidad militar:</strong> alberga hasta ${card.unitCapacity || 500} unidades.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Función:</strong> habilita la creación de tropas desde el Complejo Militar. Sin Campamento Militar activo, el Complejo no puede desplegar unidades.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><button class="trade-open-button" onclick="renderMilitaryUnitInfoCard('archer','${card.owner}','${tileId}')">Ver Arquero</button> <button class="trade-open-button" onclick="renderMilitaryUnitInfoCard('samurai','${card.owner}','${tileId}')">Ver Samurai</button> <button class="trade-open-button" onclick="renderMilitaryUnitInfoCard('yariMonk','${card.owner}','${tileId}')">Ver Monje con Yari</button></span></div>`;
  }

  if (interactionLocked && !extraControls) {
    extraControls = `<div class="locked-interaction-note">${neutralInteractionRequirement(card)}</div>`;
  }

  if (isUrbanSettlementCard(card)) {
    benefitsHtml = `
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Dominio civil:</strong> influencia de radio 1. Las construcciones iniciales y aldeanos se crean dentro de este dominio.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Aldeanos:</strong> cada Asentamiento Urbano permite 3 aldeanos base. Cada Casa agrega +2 capacidad. Cada aldeano recolecta 2 recursos por estación.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Capacidades de creación:</strong>${isCardOperational(card) ? `<div class="creation-grid">${card.creationOptions.map(option => renderCreationOption(option, card.owner)).join('')}</div>` : ' ⏳ Este asentamiento todavía no puede crear fichas.'}</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Tradeo urbano:</strong> cambia 4 recursos variados por 1 recurso elegido.<br>${isCardOperational(card) ? `<button class="trade-open-button" onclick="openUrbanTrade('${tileId}')">Abrir tradeo 4:1</button>` : '⏳ Disponible cuando el edificio esté activo.'}</span></div>`;
  }

  buildingCard.innerHTML = `
    <div class="building-card-bg" style="background-image: url('${card.background}')"></div>
    <div class="building-card-content">
      <header class="building-card-header">
        <div>
          <h2 class="building-title">${card.name}</h2>
          <p class="building-subtitle">${card.categoryLabel}</p>
        </div>
        <div class="category-icon" title="${card.categoryLabel}">${categoryIcon(card)}</div>
      </header>

      <footer class="building-card-footer">
        ${commonCostBlocks}

        <div class="card-divider"></div>

        <h3 class="card-section-title">Beneficios</h3>
        <div class="benefit-list">
          ${benefitsHtml}
        </div>
        ${pendingNotice}${extraControls}
      </footer>
    </div>`;
}




function hexTileDistance(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 0;
  const visited = new Set([a]);
  let frontier = [a];
  for (let distance = 1; distance <= 40; distance++) {
    const next = [];
    frontier.forEach(id => {
      (neighborMap[id] || []).forEach(nid => {
        if (visited.has(nid)) return;
        if (nid === b) next.push(nid);
        visited.add(nid);
        next.push(nid);
      });
    });
    if (next.includes(b)) return distance;
    frontier = next;
    if (!frontier.length) break;
  }
  return 0;
}

function marketNetworkDistance(player) {
  const network = playerState[player]?.marketNetwork;
  if (network?.active && network.sourceTileId && network.targetTileId) {
    return network.distance || hexTileDistance(network.sourceTileId, network.targetTileId) || 1;
  }
  return 0;
}

function marketNetworkAnnualAmount(player) {
  const distance = marketNetworkDistance(player);
  if (!distance) return 0;
  return Math.max(2, Math.min(10, distance));
}

function openMarketNetworkInfo(player = currentPlayer) {
  const returnToAnnual = frontModalMode === 'annualBenefits';
  const network = playerState[player]?.marketNetwork;
  const distance = marketNetworkDistance(player);
  const amount = marketNetworkAnnualAmount(player);
  const routeText = network?.active ? `Ruta activa: ${network.sourceTileId} ⇄ ${network.targetTileId}. Distancia: ${distance} casillas.` : 'Todavía no tienes una ruta activa.';
  openFrontModal({
    mode: 'marketNetworkInfo',
    title: 'Red de Mercados',
    subtitle: playerState[player]?.name || 'Jugador',
    closable: true,
    bodyClass: 'card-modal-body single-front-card-body',
    bodyHtml: `<article class="floating-card debt-front-card annual-benefits-front-card">
      <div class="floating-card-bg" style="background-image:url('assets/cards/comercio-rutas-caravanas-bg.png')"></div>
      <div class="floating-card-content">
        <header class="floating-card-header"><div><h3>Red de Mercados</h3><p>Rutas internas y retorno por distancia</p></div><div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div></header>
        <footer class="floating-card-footer annual-benefit-summary">
          <p>${routeText}</p>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>Cuanto más lejos esté el segundo Mercado, mayor será el retorno anual de la red.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>La red mejora en -1 el índice de cambio del Mercado y genera recursos anuales extra según la distancia de la ruta.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>Retorno actual estimado: <strong>${amount || 0}</strong> recursos anuales extra, repartidos entre los recursos con mejor índice.</span></div>
          <button class="create-button" onclick="${returnToAnnual ? 'restoreAnnualBenefitsSummary()' : 'hideFrontModal({force:true})'}">Cerrar</button>
        </footer>
      </div>
    </article>`
  });
}

function getOwnedMarketTiles(player) {
  return Object.entries(playerBuildingCards)
    .filter(([, card]) => card && card.owner === player && card.buildingKind === 'market' && isCardOperational(card))
    .map(([tileId]) => tileId);
}

function beginMarketNetworkSelection(sourceTileId) {
  const sourceCard = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId];
  if (!sourceCard || sourceCard.buildingKind !== 'market') return;
  const player = sourceCard.owner;
  if (!canCurrentPlayerActAs(player)) { addLog(turnLockedMessage(player), 'warn'); return; }
  if (!isCardOperational(sourceCard)) { addLog('Este Mercado todavía está en preparación.', 'warn'); return; }
  if ((playerState[player]?.marketRateBonus || 0) >= 1) { addLog('La Red de Mercados ya está activa.', player); return; }
  const markets = getOwnedMarketTiles(player).filter(id => id !== sourceTileId);
  if (!markets.length) { addLog('Necesitas otro Mercado activo para crear una Red de Mercados.', 'warn'); return; }
  marketNetworkMode = { player, sourceTileId, targets: markets };
  selectedId = sourceTileId;
  renderBuildingCard(sourceTileId);
  addLog('Selecciona el otro Mercado con el que quieres conectar la Red de Mercados.', player);
  drawBoard();
}

function showMarketNetworkConfirm(targetTileId) {
  if (!marketNetworkMode || !marketNetworkMode.targets.includes(targetTileId)) return false;
  const { player, sourceTileId } = marketNetworkMode;
  const canPay = (playerState[player].resources.gold || 0) >= 1;
  const sourceName = playerBuildingCards[sourceTileId]?.name || 'Mercado origen';
  const targetName = playerBuildingCards[targetTileId]?.name || 'Mercado destino';
  const distance = hexTileDistance(sourceTileId, targetTileId) || 1;
  const estimated = Math.max(2, Math.min(10, distance));
  actionCard.className = `mini-action-card ${ownerClass(player)} action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('assets/cards/comercio-rutas-caravanas-bg.png')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box"><h2>Red de Mercados</h2><p>${sourceName} ⇄ ${targetName}</p></div>
        <div class="mini-category-icon">${categoryIcon({ category: 'economico', categoryLabel: 'Comercio' })}</div>
      </header>
      <section class="mini-action-body">
        <p>Conectar estos mercados cuesta ${inlineResource('gold', 1)}.</p>
        <p>Distancia de ruta: <strong>${distance}</strong> casillas. Retorno anual estimado: <strong>${estimated}</strong> recursos extra.</p>
        <p>Beneficio: mejora en -1 el índice de cambio del Mercado y genera recursos anuales extra. Entre más lejos esté el segundo Mercado, mayor será el retorno de la Red de Mercados.</p>
        ${canPay ? `<button class="create-button" onclick="confirmMarketNetwork('${targetTileId}')">Pagar y conectar red</button>` : `<div class="locked-interaction-note">No tienes 1 Oro disponible para activar la red.</div>`}
        <button class="cancel-button" onclick="cancelMarketNetworkSelection()">Cancelar</button>
      </section>
    </div>`;
  return true;
}

function confirmMarketNetwork(targetTileId) {
  if (!marketNetworkMode || !marketNetworkMode.targets.includes(targetTileId)) return;
  const player = marketNetworkMode.player;
  const state = playerState[player];
  if ((state.resources.gold || 0) < 1) { addLog('Necesitas 1 Oro para conectar la Red de Mercados.', 'warn'); return; }
  state.resources.gold -= 1;
  state.marketRateBonus = Math.min(1, (state.marketRateBonus || 0) + 1);
  state.marketNetwork = { active: true, sourceTileId: marketNetworkMode.sourceTileId, targetTileId, distance: hexTileDistance(marketNetworkMode.sourceTileId, targetTileId) || 1 };
  addLog(`${playerState[player].name} conecta una Red de Mercados a distancia ${state.marketNetwork.distance} y mejora sus índices comerciales.`, player);
  marketNetworkMode = null;
  clearActionCard();
  renderHud();
  drawBoard();
}

function cancelMarketNetworkSelection() {
  marketNetworkMode = null;
  clearActionCard();
  drawBoard();
}

function renderMilitaryUnitInfoCard(type, player = currentPlayer, sourceTileId = null) {
  const info = militaryUnitInfo(type);
  const build = militaryUnitBuildData(type);
  const token = unitTokenAsset(type, player);
  buildingCard.className = `building-info-card ${ownerClass(player)}`;
  buildingCard.innerHTML = `
    <div class="building-card-bg" style="background-image: url('${info.art}')"></div>
    <div class="building-card-content">
      <header class="building-card-header">
        <div><h2 class="building-title">${info.name}</h2><p class="building-subtitle">${info.subtitle}</p></div>
        <div class="category-icon" title="Unidad Militar"><img src="${token}" alt="${info.name}" /></div>
      </header>
      <footer class="building-card-footer">
        <div class="cost-grid">
          <div class="cost-block"><span class="cost-label">Legión básica</span><div class="resource-row text-cost">${info.legion} unidades</div></div>
          <div class="cost-block"><span class="cost-label">Costo de creación</span><div class="resource-row">${resourceCostHtml(build.cost)}</div></div>
        </div>
        <div class="card-divider"></div>
        <h3 class="card-section-title">Rol militar</h3>
        <div class="benefit-list">
          <div class="benefit-item"><span class="benefit-dot">◆</span><span>${info.role}</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Tiempo de habilitación:</strong> ${build.turns} cambio de turno. Mientras espera, funciona como ficha bloqueada.</span></div>
          ${build.canCreate && sourceTileId ? (() => { const sourceCard = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId]; const reason = militaryUnitCreationBlockReason(sourceCard, type); return reason ? `<div class="benefit-item"><span class="benefit-dot">◆</span><span><button class="trade-open-button locked-button" onclick="addLog('${reason.replace(/'/g, "\'")}', 'warn')">Crear ${info.name}</button><br><small>${reason}</small></span></div>` : `<div class="benefit-item"><span class="benefit-dot">◆</span><span><button class="trade-open-button" onclick="beginMilitaryUnitPlacement('${sourceTileId}','${type}')">Crear ${info.name}</button></span></div>`; })() : `<div class="benefit-item"><span class="benefit-dot">◆</span><span>Unidad informativa. Su creación se desbloqueará por su edificio correspondiente.</span></div>`}
        </div>
      </footer>
    </div>`;
}

function beginMilitaryUnitPlacement(sourceTileId, unitType) {
  const card = playerBuildingCards[sourceTileId] || buildingCards[sourceTileId];
  if (!card || !(card.buildingKind === 'militaryComplex' || card.buildingKind === 'militaryCamp')) return;
  const player = card.owner;
  if (!canCurrentPlayerActAs(player)) { addLog(turnLockedMessage(player), 'warn'); return; }
  const build = militaryUnitBuildData(unitType);
  const blockReason = militaryUnitCreationBlockReason(card, unitType);
  if (blockReason) { renderMilitaryUnitInfoCard(unitType, player, sourceTileId); addLog(blockReason, 'warn'); return; }
  const validPointIds = pointsForCell(sourceTileId).map(point => point.id).filter(id => !pointUnits[id]);
  if (!validPointIds.length) { addLog('No hay puntos libres alrededor del edificio para desplegar esta unidad.', 'warn'); return; }
  movementMode = { type: 'placeMilitaryUnit', player, sourceTileId, unitType, validPointIds };
  selectedId = sourceTileId;
  renderMilitaryUnitInfoCard(unitType, player, sourceTileId);
  addLog(`Selecciona un punto alrededor del edificio para crear ${build.label}.`, player);
  drawBoard();
}

function placeMilitaryUnitAtPoint(pointId) {
  if (!movementMode || movementMode.type !== 'placeMilitaryUnit') return false;
  if (!movementMode.validPointIds.includes(pointId)) return false;
  if (pointUnits[pointId]) return false;
  const { player, unitType } = movementMode;
  const build = militaryUnitBuildData(unitType);
  if (!payCost(player, build.cost)) return false;
  pointUnits[pointId] = { type: unitType, owner: player, speed: build.speed, legion: build.legion, lastMoveTurn: null, extraMoves: 0, readyTurnSerial: turnSerial + 2, source: 'military' };
  playerState[player].units[unitType] = (playerState[player].units[unitType] || 0) + build.legion;
  selectedPointId = pointId;
  movementMode = null;
  renderHud();
  drawBoard();
  renderTileInfoForPoint(getPointById(pointId));
  renderMilitaryPointUnitCard(pointId);
  addLog(`${playerState[player].name} crea ${build.label} en ${pointId}. Queda en preparación hasta el siguiente ciclo.`, player);
  return true;
}

function canPointUnitMoveNow(unit) {
  if (!unit) return false;
  if ((unit.readyTurnSerial || 0) > turnSerial) return false;
  return (unit.lastMoveTurn !== turnSerial) || (unit.extraMoves || 0) > 0;
}

function beginPointUnitMove(pointId) {
  const unit = getPointUnit(pointId);
  if (!unit) return;
  if (!canCurrentPlayerActAs(unit.owner)) { addLog(turnLockedMessage(unit.owner), 'warn'); return; }
  if ((unit.readyTurnSerial || 0) > turnSerial) { addLog('Esta unidad está en preparación y todavía no puede moverse.', 'warn'); return; }
  if (!canPointUnitMoveNow(unit)) { addLog('Esta unidad ya se movió en este turno.', 'warn'); return; }
  movementMode = { type: 'movePointUnit', player: unit.owner, fromPointId: pointId, validPointIds: getReachablePoints(pointId, unit.speed || 1) };
  addLog(`Selecciona un punto de destino para ${militaryUnitInfo(unit.type).name}.`, unit.owner);
  drawBoard();
}

function movePointUnitToPoint(pointId) {
  if (!movementMode || movementMode.type !== 'movePointUnit') return false;
  if (!movementMode.validPointIds.includes(pointId)) return false;
  if (pointUnits[pointId]) return false;
  const unit = pointUnits[movementMode.fromPointId];
  if (!unit) return false;
  delete pointUnits[movementMode.fromPointId];
  pointUnits[pointId] = unit;
  if (unit.lastMoveTurn === turnSerial && unit.extraMoves > 0) unit.extraMoves -= 1;
  else unit.lastMoveTurn = turnSerial;
  selectedPointId = pointId;
  movementMode = null;
  drawBoard();
  renderTileInfoForPoint(getPointById(pointId));
  if (unit.type === 'daimyo') renderDaimyoCard(pointId); else renderMilitaryPointUnitCard(pointId);
  addLog(`${playerState[unit.owner].name} mueve ${unit.type === 'daimyo' ? 'su Daimio' : militaryUnitInfo(unit.type).name} a ${pointId}.`, unit.owner);
  return true;
}

function renderMilitaryPointUnitCard(pointId) {
  const unit = getPointUnit(pointId);
  if (!unit) return;
  const info = militaryUnitInfo(unit.type);
  const token = unitTokenAsset(unit.type, unit.owner);
  const waitNote = (unit.readyTurnSerial || 0) > turnSerial ? `⏳ En preparación: podrá moverse cuando termine su tiempo de habilitación.` : '';
  const canMove = !setupState.active && canCurrentPlayerActAs(unit.owner) && canPointUnitMoveNow(unit);
  buildingCard.className = `building-info-card ${ownerClass(unit.owner)}`;
  buildingCard.innerHTML = `
    <div class="building-card-bg" style="background-image: url('${info.art}')"></div>
    <div class="building-card-content">
      <header class="building-card-header">
        <div><h2 class="building-title">${info.name}</h2><p class="building-subtitle">${info.subtitle}</p></div>
        <div class="category-icon" title="Unidad Militar"><img src="${token}" alt="${info.name}" /></div>
      </header>
      <footer class="building-card-footer">
        <div class="cost-grid">
          <div class="cost-block"><span class="cost-label">Legión</span><div class="resource-row text-cost">${unit.legion || info.legion} unidades</div></div>
          <div class="cost-block"><span class="cost-label">Movimiento</span><div class="resource-row text-cost">${unit.speed || 1} puntos</div></div>
        </div>
        <div class="card-divider"></div>
        <h3 class="card-section-title">Acciones</h3>
        <div class="benefit-list"><div class="benefit-item"><span class="benefit-dot">◆</span><span>${info.role}</span></div></div>
        ${waitNote ? `<div class="locked-interaction-note">${waitNote}</div>` : ''}
        <div class="contract-controls"><button class="blue-btn" ${canMove ? '' : 'disabled'} onclick="beginPointUnitMove('${pointId}')">Mover</button></div>
      </footer>
    </div>`;
}

function openUnitInfo(type, player = currentPlayer) {
  const info = militaryUnitInfo(type);
  const token = unitTokenAsset(type, player);
  const creatable = type !== 'yariMonk';
  const note = type === 'yariMonk'
    ? 'Esta unidad se desbloquea por Templo/Monasterio. Todavía no se puede crear desde el Complejo Militar.'
    : 'Carta de información. La creación y combate completo se integrarán en la siguiente fase.';
  const bodyHtml = `<article class="floating-card ${ownerClass(player)} debt-front-card">
    <div class="floating-card-bg" style="background-image:url('${info.art}')"></div>
    <div class="floating-card-content">
      <header class="floating-card-header">
        <div class="floating-card-title-box"><h3>${info.name}</h3><p>${info.subtitle}</p></div>
        <div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.militar}" alt="" /></div>
      </header>
      <footer class="floating-card-footer">
        <div class="token-preview-row"><img class="token-preview" src="${token}" alt="${info.name}"/><span>Ficha de unidad</span></div>
        <h3>Tamaño de legión</h3><p><strong>${info.legion}</strong> unidades por legión básica.</p>
        <h3>Rol</h3><p>${info.role}</p>
        <p class="mini-note">${note}</p>
        <button class="create-button" onclick="hideFrontModal({force:true})">Cerrar</button>
      </footer>
    </div>
  </article>`;
  openFrontModal({ mode: 'unitInfo', title: info.name, subtitle: info.subtitle, bodyHtml, closable: true, bodyClass: 'card-modal-body single-front-card-body' });
}

function improveMarketRate(player) {
  const state = playerState[player];
  if (!canCurrentPlayerActAs(player)) { addLog(turnLockedMessage(player), 'warn'); return; }
  if ((state.resources.gold || 0) < 1) { addLog('Necesitas 1 Oro para mejorar una tasa de mercado.', 'warn'); return; }
  state.marketRateBonus = Math.min(1, (state.marketRateBonus || 0) + 1);
  state.resources.gold -= 1;
  renderHud();
  addLog(`${playerState[player].name} activa Red de Mercados: mejora en -1 el índice de cambio de sus recursos.`, player);
}

function getBestMarketResourceCandidates(player) {
  const rates = {};
  resourceTypes.forEach(type => rates[type] = getMarketRate(player, type));
  const best = Math.min(...Object.values(rates));
  return Object.entries(rates).filter(([,rate]) => rate === best).map(([type]) => type);
}

function marketNetworkAnnualBonus(player) {
  const network = playerState[player]?.marketNetwork;
  if (!network?.active) return { gain: {}, entries: [] };
  const candidates = getBestMarketResourceCandidates(player);
  const amount = marketNetworkAnnualAmount(player);
  const gain = {};
  for (let i = 0; i < amount; i++) {
    const type = candidates[Math.floor(Math.random() * candidates.length)] || 'wood';
    gain[type] = (gain[type] || 0) + 1;
  }
  const entries = [];
  if (Object.keys(gain).length) {
    entries.push({ player, cardName: 'Red de Mercados', tileId: '', icon: categoryAssets.economico, benefit: gain, networkInfo: true });
  }
  return { gain, entries };
}

function renderUnitCard(tileId) {
  const unit = placedUnits[tileId];
  if (!unit) return;
  const resourceType = unit.gathers || resourceAssignments[tileId];
  const totalCount = unit.count || 1;
  const activeCount = getActiveVillagersOnTile(tileId);
  const pendingCount = 0;
  const owner = unit.owner || 'neutral';
  buildingCard.className = `building-info-card ${ownerClass(owner)}`;
  buildingCard.innerHTML = `
    <div class="building-card-bg" style="background-image: url('assets/cards/aldeano-bg.png')"></div>
    <div class="building-card-content">
      <header class="building-card-header">
        <div>
          <h2 class="building-title">Aldeano${totalCount > 1 ? ` x${totalCount}` : ''}</h2>
          <p class="building-subtitle">Unidad Civil · Recolector</p>
        </div>
        <div class="category-icon" title="Civil">${categoryIcon({ category: 'civil', categoryLabel: 'Civil' })}</div>
      </header>
      <footer class="building-card-footer">
        <div class="cost-grid">
          <div class="cost-block">
            <span class="cost-label">Costo de creación</span>
            <div class="resource-row">${resourceCostHtml({ food: 2 })}</div>
          </div>
          <div class="cost-block">
            <span class="cost-label">Impuesto anual por aldeano</span>
            <div class="resource-row">${resourceCostHtml({ food: 1 })}</div>
          </div>
        </div>
        <div class="card-divider"></div>
        <h3 class="card-section-title">Trabajo actual</h3>
        <div class="benefit-list">
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Recurso:</strong> ${resourceType ? inlineResource(resourceType, 1) : 'Sin recurso asignado'}.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Producción activa:</strong> ${resourceType ? inlineResource(resourceType, 2 * activeCount) : '0'} por estación, al inicio del turno propio (${activeCount} activo${activeCount !== 1 ? 's' : ''}).</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Activación:</strong> inmediata. Los aldeanos no esperan ronda ni cambio de estación.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Nota:</strong> la producción puede modificarse por cartas, edificios o reglas futuras.</span></div>
        </div>
      </footer>
    </div>`;
}

function getPointUnit(pointId) {
  return pointUnits[pointId] || null;
}

function daimyoReadyTurnText(unit) {
  const readyTurn = unit?.readyTurnSerial || 0;
  if (readyTurn <= turnSerial) return '';
  const remaining = readyTurn - turnSerial;
  return `⏳ En preparación: este Daimio podrá moverse cuando pase la primera ronda (${remaining} turno${remaining > 1 ? 's' : ''}).`;
}

function canDaimyoMoveNow(unit) {
  if (!unit || unit.type !== 'daimyo') return false;
  if ((unit.readyTurnSerial || 0) > turnSerial) return false;
  return (unit.lastMoveTurn !== turnSerial) || (unit.extraMoves || 0) > 0;
}

function getNegotiableBuildingsForDaimyo(pointId, player) {
  const point = getPointById(pointId);
  if (!point) return [];
  return point.linkedCells.map(tileId => ({ tileId, card: buildingCards[tileId] || playerBuildingCards[tileId] }))
    .filter(entry => entry.card && !entry.card.isPlayerBuilt && entry.card.owner === 'neutral' && entry.card.acquisitionCost && Object.keys(entry.card.acquisitionCost).length);
}

function renderDaimyoCard(pointId) {
  const unit = getPointUnit(pointId);
  if (!unit) return;
  const deals = getNegotiableBuildingsForDaimyo(pointId, unit.owner);
  const canMove = !setupState.active && canCurrentPlayerActAs(unit.owner) && canDaimyoMoveNow(unit);
  const waitNote = daimyoReadyTurnText(unit);
  const canDeal = deals.length > 0 && canCurrentPlayerActAs(unit.owner);
  buildingCard.className = `building-info-card ${ownerClass(unit.owner)}`;
  buildingCard.innerHTML = `
    <div class="building-card-bg" style="background-image: url('assets/cards/daimyo-bg.png')"></div>
    <div class="building-card-content">
      <header class="building-card-header">
        <div>
          <h2 class="building-title">Daimio</h2>
          <p class="building-subtitle">Unidad Diplomática · Movilidad ${unit.speed || 2}</p>
        </div>
        <div class="category-icon" title="Diplomático"><img src="${daimyoAsset(unit.owner)}" alt="Daimio" /></div>
      </header>
      <footer class="building-card-footer">
        <div class="cost-grid">
          <div class="cost-block">
            <span class="cost-label">Movimiento</span>
            <div class="resource-row text-cost">${unit.speed || 2} puntos por turno</div>
          </div>
          <div class="cost-block">
            <span class="cost-label">Ubicación actual</span>
            <div class="resource-row text-cost">${pointId}</div>
          </div>
        </div>
        <div class="card-divider"></div>
        <h3 class="card-section-title">Acciones</h3>
        <div class="benefit-list">
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Cerrar trato:</strong> cuando el Daimio está en un vértice de un edificio neutral, puede adquirirlo pagando su costo.</span></div>
          <div class="benefit-item"><span class="benefit-dot">◆</span><span><strong>Edificios negociables aquí:</strong> ${deals.length ? deals.map(entry => entry.card.name).join(', ') : 'Ninguno.'}</span></div>
        </div>
        ${waitNote ? `<div class="locked-interaction-note">${waitNote}</div>` : ''}
        <div class="contract-controls">
          <button class="blue-btn" ${canMove ? '' : 'disabled'} onclick="beginDaimyoMove('${pointId}')">Mover</button>
          <button class="red-btn" ${canDeal ? '' : 'disabled'} onclick="openDaimyoDealMenu('${pointId}')">Cerrar trato</button>
        </div>
      </footer>
    </div>`;
}

function beginInitialDaimyoPlacement(player, urbanTileId) {
  setupState.placingPlayer = player;
  setupState.phase = player === setupState.firstChooser ? 'placeFirstDaimyo' : 'placeSecondDaimyo';
  movementMode = { type: 'placeDaimyo', player, validPointIds: pointsForCell(urbanTileId).map(point => point.id), speed: 0, sourceTileId: urbanTileId };
  setSetupMessage(`${playerState[player].name}: coloca tu Daimio en uno de los puntos del Asentamiento Urbano.`, player);
  drawBoard();
}

function finishInitialDaimyoPlacement(player) {
  movementMode = null;
  setupState.daimyoPlaced[player] = true;
  if (setupState.phase === 'placeFirstDaimyo') {
    setupState.placingPlayer = setupState.secondChooser;
    setupState.phase = 'placeSecondUrban';
    setSetupMessage(`${playerState[setupState.secondChooser].name}: coloca ahora tu Asentamiento Urbano. No puede estar dentro del radio 2 del primer Asentamiento Urbano.`, setupState.secondChooser);
  } else if (setupState.phase === 'placeSecondDaimyo') {
    setupState.active = false;
    setupState.placingPlayer = null;
    setupState.phase = 'complete';
    currentPlayer = setupState.secondChooser;
    playerState.blue.lastVillagerIncomeSeason = seasonKey();
    playerState.red.lastVillagerIncomeSeason = seasonKey();
    startInitialTradeProtectionForAllPlayers();
    setActiveHudPlayer(currentPlayer);
    updateTurnHud();
    hideSetupModal();
    const startingUrban = Object.values(playerBuildingCards).find(card => isUrbanSettlementCard(card) && card.owner === currentPlayer);
    if (startingUrban) {
      selectedId = startingUrban.tileId;
      selectedPointId = null;
      renderTileInfoForCell(getCellById(selectedId));
      renderBuildingCard(selectedId);
      showInfluence(selectedId, startingUrban.influenceRadius || 1, currentPlayer);
    }
    setSetupMessage(`Setup completo. Primer turno real: ${playerState[currentPlayer].name}.`, currentPlayer);
    renderHud();
    drawBoard();
    // Abrir el aviso después de ocultar la ventana de setup y redibujar evita que quede tapado
    // o que otra actualización visual lo cierre en el mismo ciclo.
    window.setTimeout(() => showInitialTradeProtectionGranted(), 80);
    window.setTimeout(() => showTurnSweep(currentPlayer), 220);
    return;
  }
  renderHud();
  drawBoard();
}

function placeInitialDaimyoAtPoint(pointId) {
  if (!movementMode || movementMode.type !== 'placeDaimyo') return false;
  if (!movementMode.validPointIds.includes(pointId)) return false;
  const player = movementMode.player;
  pointUnits[pointId] = { type: 'daimyo', owner: player, speed: 2, lastMoveTurn: null, extraMoves: 0, readyTurnSerial: turnSerial + 2 };
  playerState[player].units.diplomat = 1;
  selectedPointId = pointId;
  renderTileInfoForPoint(getPointById(pointId));
  renderDaimyoCard(pointId);
  addLog(`${playerState[player].name} coloca su Daimio en ${pointId}. Queda en preparación y no podrá moverse hasta que pase la primera ronda.`, player);
  finishInitialDaimyoPlacement(player);
  return true;
}

function beginDaimyoMove(pointId) {
  const unit = getPointUnit(pointId);
  if (!unit || unit.type !== 'daimyo') return;
  if (!canCurrentPlayerActAs(unit.owner)) { addLog(turnLockedMessage(unit.owner), 'warn'); return; }
  if ((unit.readyTurnSerial || 0) > turnSerial) { addLog('Este Daimio está en preparación y no puede moverse hasta que pase la primera ronda.', 'warn'); return; }
  if (unit.lastMoveTurn === turnSerial && !(unit.extraMoves > 0)) { addLog('Este Daimio ya se movió en este turno.', 'warn'); return; }
  movementMode = { type: 'moveDaimyo', player: unit.owner, fromPointId: pointId, validPointIds: getReachablePoints(pointId, unit.speed || 2) };
  addLog(`Selecciona un punto de destino para el Daimio de ${playerState[unit.owner].name}.`, unit.owner);
  drawBoard();
}

function moveDaimyoToPoint(pointId) {
  if (!movementMode || movementMode.type !== 'moveDaimyo') return false;
  if (!movementMode.validPointIds.includes(pointId)) return false;
  const unit = pointUnits[movementMode.fromPointId];
  if (!unit) return false;
  delete pointUnits[movementMode.fromPointId];
  pointUnits[pointId] = unit;
  if (unit.lastMoveTurn === turnSerial && unit.extraMoves > 0) unit.extraMoves -= 1;
  else unit.lastMoveTurn = turnSerial;
  selectedPointId = pointId;
  movementMode = null;
  drawBoard();
  renderTileInfoForPoint(getPointById(pointId));
  renderDaimyoCard(pointId);
  addLog(`${playerState[unit.owner].name} mueve su Daimio a ${pointId}.`, unit.owner);
  return true;
}

function openDaimyoDealMenu(pointId) {
  const unit = getPointUnit(pointId);
  if (!unit) return;
  const deals = getNegotiableBuildingsForDaimyo(pointId, unit.owner);
  if (!deals.length) { addLog('No hay edificios neutrales negociables desde este punto.', 'warn'); return; }
  actionCard.className = `mini-action-card ${ownerClass(unit.owner)} action-card-overlay trade-card`;
  actionCard.innerHTML = `
    <div class="mini-action-bg" style="background-image: url('assets/cards/daimyo-bg.png')"></div>
    <div class="mini-action-content">
      <header class="mini-action-header">
        <div class="mini-action-title-box">
          <h2>Cerrar trato</h2>
          <p>Daimio · Negociación</p>
        </div>
        <div class="mini-category-icon" title="Diplomático"><img src="${daimyoAsset(unit.owner)}" alt="Daimio" /></div>
      </header>
      <section class="mini-action-body">
        <p class="mini-note">Selecciona el edificio neutral que quieres adquirir desde este vértice.</p>
        ${deals.map(entry => `
          <div class="deal-option">
            <h3>${entry.card.name}</h3>
            <p class="mini-note">Costo: ${resourceCostHtml(entry.card.acquisitionCost)}</p>
            <button class="create-button" onclick="confirmDaimyoDeal('${pointId}','${entry.tileId}')">Pagar y adquirir</button>
          </div>
        `).join('')}
        <button class="cancel-button" onclick="clearActionCard()">Cerrar</button>
      </section>
    </div>`;
}

function confirmDaimyoDeal(pointId, tileId) {
  const unit = getPointUnit(pointId);
  const card = buildingCards[tileId];
  if (!unit || !card || card.owner !== 'neutral') return;
  if (!canAfford(unit.owner, card.acquisitionCost || {})) return;
  if (!payCost(unit.owner, card.acquisitionCost || {})) return;
  card.owner = unit.owner;
  if (isPortCard(card)) {
    // Controlar/adquirir un Puerto NO contrata automáticamente la Conexión Marítima.
    // El jugador debe presionar el botón "Contratar conexión marítima" y pagar su costo.
    card.monopolyOwner = null;
    card.monopolyPending = 0;
    if (maritimeContracts[tileId]) maritimeContracts[tileId].owner = null;
    playerState[unit.owner].buildings.port += 1;
  } else if (isCommercialSettlementCard(card)) {
    playerState[unit.owner].buildings.settlement += 1;
  } else if (isTempleCard(card)) {
    playerState[unit.owner].buildings.temple += 1;
  } else if (isExplorationPostCard(card)) {
    playerState[unit.owner].buildings.exploration += 1;
  }
  clearActionCard();
  renderHud();
  drawBoard();
  renderBuildingCard(tileId);
  showInfluence(tileId, card.influenceRadius || 1, unit.owner);
  addLog(`${playerState[unit.owner].name} cierra trato y adquiere ${card.name}.`, unit.owner);
}

function renderTileInfoForCell(cell) {
  const special = cell.special;
  const resourceType = resourceAssignments[cell.id];
  const resourceText = resourceType ? resourceNames[resourceType] : 'Sin ficha de recurso';
  const setupHint = setupState.active && setupState.placingPlayer
    ? `<p class="setup-hint-line"><strong>Setup:</strong> ${isValidUrbanStartTile(cell.id, setupState.placingPlayer) ? 'Casilla válida para iniciar.' : 'No válida para Asentamiento Urbano inicial.'}</p>`
    : '';
  tileInfo.className = 'tile-info';
  tileInfo.innerHTML = `<h4>${cell.id}</h4>${setupHint}<p><strong>Fila:</strong> ${cell.row} &nbsp; <strong>Columna:</strong> ${cell.col}</p><p><strong>Terreno:</strong> ${special ? 'Especial' : cell.terrain}</p><p><strong>Tipo de casilla:</strong> ${special ? specialTypeNames[special.kind] : 'Normal'}</p><p><strong>Nombre:</strong> ${special ? special.name : 'Casilla estándar'}</p><p><strong>Recurso:</strong> ${resourceText}</p><p><strong>Descripción:</strong> ${special ? special.description : 'Hexágono individual del tablero.'}</p>`;
}

function renderTileInfoForPoint(point) {
  tileInfo.className = 'tile-info';
  tileInfo.innerHTML = `<h4>Punto de movimiento</h4><p><strong>Coordenada:</strong> (${point.x}, ${point.y})</p><p><strong>Hexágonos conectados:</strong> ${point.linkedCells.join(', ')}</p><p><strong>Uso:</strong> Punto donde se pueden mover el ejército, el diplomático y otras fichas móviles.</p>`;
}


function blockSetupMisclick(target = 'acción') {
  if (!setupState.active) return false;
  if (placementMode?.setupPlacement) {
    addLog(`Debes colocar el Aldeano inicial de ${playerState[placementMode.player].name} antes de continuar.`, 'warn');
    return true;
  }
  if (movementMode?.type === 'placeDaimyo') {
    addLog(`Debes colocar el Daimio de ${playerState[movementMode.player].name} antes de continuar.`, 'warn');
    return true;
  }
  return false;
}

function selectCell(id) {
  if (setupState.active && movementMode?.type === 'placeDaimyo') {
    addLog(`Debes colocar el Daimio de ${playerState[movementMode.player].name} en uno de los puntos marcados.`, 'warn');
    return;
  }
  if (marketNetworkMode) {
    if (marketNetworkMode.targets.includes(id)) {
      selectedId = id;
      const cell = getCellById(id);
      document.querySelectorAll('.hex-group').forEach(group => group.classList.toggle('selected', group.dataset.id === id));
      renderTileInfoForCell(cell);
      renderBuildingCard(id);
      showMarketNetworkConfirm(id);
      drawBoard();
      return;
    }
    addLog('Selecciona un Mercado válido para conectar la Red, o cancela la acción.', 'warn');
    return;
  }
  if (!placementMode) { hideActionCardOnly(); currentTrade = null; }
  if (placementMode) {
    if (quickCreatableTypes.includes(placementMode.type) && isValidPlacementTile(id)) {
      placementConfirm = { tileId: id, type: placementMode.type, player: placementMode.player };
      drawBoard();
      return;
    }
    if (placeCreatedThing(id)) return;
    if (setupState.active && placementMode.setupPlacement) {
      addLog(`Debes colocar primero el Aldeano inicial de ${playerState[placementMode.player].name} para continuar.`, 'warn');
      return;
    }
  }

  if (setupState.active && movementMode?.type === 'placeDaimyo') {
    addLog(`Debes colocar el Daimio de ${playerState[movementMode.player].name} antes de continuar.`, 'warn');
    return;
  }

  const canPlaceSetupUrban =
    setupState.active &&
    setupState.placingPlayer &&
    (setupState.phase === 'placeFirstUrban' || setupState.phase === 'placeSecondUrban');

  if (canPlaceSetupUrban) {
    if (placeUrbanSettlement(id, setupState.placingPlayer)) return;
    addLog(`${playerState[setupState.placingPlayer].name}: elige una casilla válida para fundar tu Asentamiento Urbano inicial.`, 'warn');
    return;
  }

  selectedPointId = null;
  selectedId = id;
  document.querySelectorAll('.hex-group').forEach(group => { group.classList.toggle('selected', group.dataset.id === id); });
  const cell = cells.find(item => item.id === id);
  renderTileInfoForCell(cell);

  if (cell && cell.special) {
    const card = playerBuildingCards[id] || buildingCards[id];

    if (card && !canInteractWithFixedBuilding(card)) {
      addLog(`${card.name}: ${neutralInteractionRequirement(card)}`, 'warn');
    }

    renderBuildingCard(id);
    const radius = card ? card.influenceRadius : (cell.special.kind === 'port' || cell.special.kind === 'settlement' ? 2 : 1);
    const owner = card ? card.owner : 'neutral';
    showInfluence(id, radius, owner);
  } else {
    clearInfluence();
  }

  // Redibuja después de seleccionar para que los botones rápidos aparezcan en ese mismo clic.
  drawBoard();
  if (cell && cell.special) {
    const redrawCard = playerBuildingCards[id] || buildingCards[id];
    const redrawRadius = redrawCard ? redrawCard.influenceRadius : (cell.special.kind === 'port' || cell.special.kind === 'settlement' ? 2 : 1);
    const redrawOwner = redrawCard ? redrawCard.owner : 'neutral';
    showInfluence(id, redrawRadius, redrawOwner);
  }
}


function quickActionShortLabel(option) {
  const map = {
    villager: 'Aldeano',
    house: 'Casa',
    market: 'Mercado',
    urban: 'Asent.',
    extraction: 'Extracción',
    militaryComplex: 'Complejo',
    militaryCamp: 'Campamento'
  };
  return map[option.id] || option.name || option.id;
}

function quickCreationOptionAvailable(option, card) {
  if (!option || option.locked || !card || !isCardOperational(card)) return false;
  const type = option.id === 'initialVillager' ? 'villager' : option.id;
  if (!quickCreatableTypes.includes(type)) return false;
  // Si ya no hay contador/capacidad disponible, no se muestra.
  // Si hay contador, pero faltan recursos, se muestra bloqueado en gris.
  if (isConstructionLimitBlocked(card.owner, type)) return false;
  return true;
}

function quickCreationDisabledReason(option, card) {
  if (!option || !card) return 'Opción no disponible.';
  const type = option.id === 'initialVillager' ? 'villager' : option.id;
  if (!canCurrentPlayerActAs(card.owner)) return turnLockedMessage(card.owner);
  if (!isCardOperational(card)) return 'Este edificio todavía está en preparación.';
  if (isConstructionLimitBlocked(card.owner, type)) return limitMessageFor(type, card.owner);
  if (!canAfford(card.owner, option.cost || {})) return 'Recursos insuficientes para crear esta ficha.';
  return '';
}

function handleQuickBuildingAction(tileId, action, optionId = null) {
  const card = playerBuildingCards[tileId] || buildingCards[tileId];
  if (!card) return;
  selectedId = tileId;
  const cell = getCellById(tileId);
  document.querySelectorAll('.hex-group').forEach(group => group.classList.toggle('selected', group.dataset.id === tileId));
  renderTileInfoForCell(cell);
  renderBuildingCard(tileId);
  showInfluence(tileId, card.influenceRadius || 1, card.owner || currentPlayer);

  if (action === 'create' && optionId) {
    openCreationInfo(optionId);
    return;
  }
  if (action === 'urbanTrade') {
    openUrbanTrade(tileId);
    return;
  }
  if (action === 'marketTrade') {
    openMarketTrade(tileId);
    return;
  }
  if (action === 'marketNetwork') {
    beginMarketNetworkSelection(tileId);
    return;
  }
  if (action === 'createUnit' && optionId) {
    beginMilitaryUnitPlacement(tileId, optionId);
    return;
  }
  if (action === 'unitInfoAnchored' && optionId) {
    renderMilitaryUnitInfoCard(optionId, card.owner || currentPlayer, tileId);
    return;
  }
  if (action === 'maritime') {
    contractMaritime(tileId, currentPlayer);
    return;
  }
  if (action === 'unitInfo' && optionId) {
    openUnitInfo(optionId, card.owner || currentPlayer);
    return;
  }
}

function getQuickBuildingActions(card) {
  if (!card) return [];
  const actions = [];
  const player = card.owner;
  const canAct = canCurrentPlayerActAs(player);
  const operational = isCardOperational(card);

  if (isUrbanSettlementCard(card) && card.buildingKind === 'urban') {
    const options = urbanCreationOptionsFor(player).filter(option => quickCreationOptionAvailable(option, card));
    options.forEach(option => {
      const reason = quickCreationDisabledReason(option, card);
      actions.push({
        label: quickActionShortLabel(option),
        action: 'create',
        optionId: option.id,
        tone: 'create',
        disabled: !!reason,
        disabledReason: reason
      });
    });
    if (operational && canAct) actions.push({ label: 'Tradeo', action: 'urbanTrade', tone: 'trade' });
  }

  if (card.buildingKind === 'market' && !isUrbanSettlementCard(card) && operational && canAct) {
    actions.push({ label: 'Comerciar', action: 'marketTrade', tone: 'trade' });
    if ((playerState[player]?.buildings?.market || 0) >= 2 && (playerState[player]?.marketRateBonus || 0) < 1) {
      actions.push({ label: 'Red', action: 'marketNetwork', tone: 'upgrade' });
    }
  }

  if (isPortCard(card) && operational && !card.monopolyOwner && card.owner === currentPlayer && canCurrentPlayerActAs(currentPlayer)) {
    actions.push({ label: 'Contrato', action: 'maritime', tone: 'trade' });
  }

  if (card.buildingKind === 'militaryComplex' && operational && canAct) {
    const archerReason = militaryUnitCreationBlockReason(card, 'archer');
    const samuraiReason = militaryUnitCreationBlockReason(card, 'samurai');
    actions.push({ label: 'Crear arquero', action: 'createUnit', optionId: 'archer', tone: 'military', disabled: !!archerReason, disabledReason: archerReason });
    actions.push({ label: 'Crear samurai', action: 'createUnit', optionId: 'samurai', tone: 'military', disabled: !!samuraiReason, disabledReason: samuraiReason });
    actions.push({ label: 'Ver Yari', action: 'unitInfoAnchored', optionId: 'yariMonk', tone: 'military' });
  }

  if (card.buildingKind === 'militaryCamp' && operational && canAct) {
    actions.push({ label: 'Ver arquero', action: 'unitInfoAnchored', optionId: 'archer', tone: 'military' });
    actions.push({ label: 'Ver samurai', action: 'unitInfoAnchored', optionId: 'samurai', tone: 'military' });
    actions.push({ label: 'Ver Yari', action: 'unitInfoAnchored', optionId: 'yariMonk', tone: 'military' });
  }

  return actions.slice(0, 8);
}



function cancelQuickPlacementMode(sourceTileId = null) {
  const tileId = sourceTileId || placementMode?.sourceTileId || selectedId;
  placementMode = null;
  placementConfirm = null;
  if (tileId) {
    selectedId = tileId;
    const cell = getCellById(tileId);
    const card = playerBuildingCards[tileId] || buildingCards[tileId];
    if (cell) renderTileInfoForCell(cell);
    if (card) {
      renderBuildingCard(tileId);
      showInfluence(tileId, card.influenceRadius || 1, card.owner || currentPlayer);
    }
  }
  drawBoard();
}

function appendQuickPlacementCancel(layer, card, cell) {
  if (!layer || !card || !placementMode || movementMode) return;
  if (placementMode.setupPlacement) return;
  if (placementMode.sourceTileId !== cell.id) return;
  const wrap = createSvgElement('g');
  wrap.setAttribute('class', `quick-building-actions owner-${card.owner || 'neutral'} quick-cancel-actions`);
  wrap.setAttribute('transform', `translate(${(cell.cx + 42).toFixed(2)}, ${(cell.cy - 54).toFixed(2)})`);

  const g = createSvgElement('g');
  g.setAttribute('class', 'quick-building-button quick-building-cancel');
  g.addEventListener('click', (event) => {
    event.stopPropagation();
    cancelQuickPlacementMode(cell.id);
  });

  const rect = createSvgElement('rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', '96');
  rect.setAttribute('height', '24');
  rect.setAttribute('rx', '8');
  g.appendChild(rect);

  const text = createSvgElement('text');
  text.setAttribute('x', '48');
  text.setAttribute('y', '16');
  text.textContent = 'Cancelar';
  g.appendChild(text);

  wrap.appendChild(g);
  layer.appendChild(wrap);
}

function appendQuickBuildingActions(layer, card, cell) {
  if (!layer || !card || selectedId !== cell.id || placementMode || movementMode || setupState.active) return;
  const actions = getQuickBuildingActions(card);
  if (!actions.length) return;

  const wrap = createSvgElement('g');
  wrap.setAttribute('class', `quick-building-actions owner-${card.owner || 'neutral'}`);
  const columns = actions.length > 4 ? 2 : 1;
  const buttonW = columns === 2 ? 82 : 96;
  const buttonH = 24;
  const gap = 5;
  const startX = cell.cx + 42;
  const startY = cell.cy - Math.min(54, actions.length * 14);
  wrap.setAttribute('transform', `translate(${startX.toFixed(2)}, ${startY.toFixed(2)})`);

  actions.forEach((item, index) => {
    const col = columns === 2 ? index % 2 : 0;
    const row = columns === 2 ? Math.floor(index / 2) : index;
    const g = createSvgElement('g');
    g.setAttribute('class', `quick-building-button quick-building-${item.tone || 'default'}${item.disabled ? ' quick-building-disabled' : ''}`);
    g.setAttribute('transform', `translate(${col * (buttonW + gap)}, ${row * (buttonH + gap)})`);
    g.addEventListener('click', (event) => {
      event.stopPropagation();
      if (item.disabled) {
        addLog(item.disabledReason || 'Esta acción no está disponible todavía.', 'warn');
        return;
      }
      handleQuickBuildingAction(cell.id, item.action, item.optionId || null);
    });
    const rect = createSvgElement('rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', String(buttonW));
    rect.setAttribute('height', String(buttonH));
    rect.setAttribute('rx', '8');
    g.appendChild(rect);
    const text = createSvgElement('text');
    text.setAttribute('x', String(buttonW / 2));
    text.setAttribute('y', '16');
    text.textContent = item.label;
    g.appendChild(text);
    wrap.appendChild(g);
  });
  layer.appendChild(wrap);
}

function drawBoard() {
  boardSvg.innerHTML = '';
  const cellLayer = createSvgElement('g');
  const pointLayer = createSvgElement('g');
  const uiOverlayLayer = createSvgElement('g');

  cells.forEach(cell => {
    const group = createSvgElement('g');
    const className = cell.special ? specialClass[cell.special.kind] : '';
    const setupClass = setupState.active && setupState.placingPlayer && (setupState.phase === 'placeFirstUrban' || setupState.phase === 'placeSecondUrban') && isValidUrbanStartTile(cell.id, setupState.placingPlayer) ? 'setup-valid-start' : '';
    const placementClass = placementMode && isValidPlacementTile(cell.id) ? 'placement-valid' : '';
    const ownerCard = playerBuildingCards[cell.id] || buildingCards[cell.id];
    const ownerMapClass = ownerCard ? `map-owner-${ownerCard.owner}` : '';
    const selectedClass = selectedId === cell.id ? 'selected' : '';
    const networkClass = marketNetworkMode?.targets?.includes(cell.id) ? 'market-network-target' : '';
    const sparseHintClass = prospectiveSparseUrbanHintTileId === cell.id && setupState.active && setupState.phase === 'placeSecondUrban' ? 'prospective-sparse-urban-hint' : '';
    group.setAttribute('class', `hex-group ${className} ${setupClass} ${placementClass} ${ownerMapClass} ${selectedClass} ${networkClass} ${sparseHintClass}`);
    group.dataset.id = cell.id;

    const polygon = createSvgElement('polygon');
    polygon.setAttribute('class', 'hex-fill');
    polygon.setAttribute('points', pointsToString(cell.points));
    polygon.addEventListener('click', () => selectCell(cell.id));
    group.appendChild(polygon);
    const center = createSvgElement('circle');
    center.setAttribute('class', 'hex-center');
    center.setAttribute('cx', cell.cx);
    center.setAttribute('cy', cell.cy);
    center.setAttribute('r', '4.4');
    group.appendChild(center);

    const idLabel = createSvgElement('text');
    idLabel.setAttribute('class', 'cell-label');
    idLabel.setAttribute('x', cell.cx);
    idLabel.setAttribute('y', cell.cy - 15);
    idLabel.textContent = cell.id;
    group.appendChild(idLabel);

    if (cell.special) {
      const building = createSvgElement('image');
      building.setAttribute('class', 'building-token');
      const card = playerBuildingCards[cell.id] || buildingCards[cell.id];
      const owner = card ? card.owner : 'neutral';
      const assetSet = buildingAssets[cell.special.kind];
      const href = assetSet ? (assetSet[owner] || assetSet.neutral) : '';
      building.setAttribute('href', href);

      const isSettlement = cell.special.kind === 'settlement';
      const isChurch = cell.special.kind === 'church';
      const isUrban = cell.special.kind === 'urban';
      const baseWidth = isSettlement ? 64 : (isChurch ? 60 : (isUrban ? 68 : 60));
      const baseHeight = isSettlement ? 64 : (isChurch ? 60 : (isUrban ? 68 : 60));
      const width = Math.round(baseWidth * 1.25);
      const height = Math.round(baseHeight * 1.25);

      const shadow = createSvgElement('ellipse');
      shadow.setAttribute('class', 'building-base-shadow');
      shadow.setAttribute('cx', cell.cx);
      shadow.setAttribute('cy', (cell.cy + 44).toFixed(2));
      shadow.setAttribute('rx', isSettlement || isUrban ? '45' : '38');
      shadow.setAttribute('ry', '10');
      group.appendChild(shadow);

      building.setAttribute('x', (cell.cx - width / 2).toFixed(2));
      building.setAttribute('y', (cell.cy - height / 2 + 2).toFixed(2));
      building.setAttribute('width', width);
      building.setAttribute('height', height);
      group.appendChild(building);

      const categoryBadgeSrc = card ? (categoryAssets[card.category] || categoryAssets.civil) : categoryAssets.civil;
      const badge = createSvgElement('image');
      badge.setAttribute('class', 'building-category-badge');
      badge.setAttribute('href', categoryBadgeSrc);
      badge.setAttribute('x', (cell.cx + width / 2 - 24).toFixed(2));
      badge.setAttribute('y', (cell.cy + height / 2 - 22).toFixed(2));
      badge.setAttribute('width', '24');
      badge.setAttribute('height', '24');
      group.appendChild(badge);
      if (card && card.pendingSeasons && card.pendingSeasons > 0) {
        const pendingCx = cell.cx;
        const pendingCy = cell.cy;
        const buildPendingCircle = createSvgElement('circle');
        buildPendingCircle.setAttribute('class', `building-pending-badge badge-${card.owner}`);
        buildPendingCircle.setAttribute('cx', pendingCx.toFixed(2));
        buildPendingCircle.setAttribute('cy', pendingCy.toFixed(2));
        buildPendingCircle.setAttribute('r', '14');
        group.appendChild(buildPendingCircle);
        const buildPendingText = createSvgElement('text');
        buildPendingText.setAttribute('class', 'building-pending-text');
        buildPendingText.setAttribute('x', pendingCx.toFixed(2));
        buildPendingText.setAttribute('y', (pendingCy + 5).toFixed(2));
        buildPendingText.textContent = '⏳';
        group.appendChild(buildPendingText);
      }
      if (card && card.buildingKind === 'extraction' && isCardOperational(card)) {
        const delayText = createSvgElement('text');
        delayText.setAttribute('class', 'extraction-delay-text');
        delayText.setAttribute('x', (cell.cx - 34).toFixed(2));
        delayText.setAttribute('y', (cell.cy - 34).toFixed(2));
        delayText.textContent = `⏳${card.transportDelay || 1}`;
        group.appendChild(delayText);
      }

      if (card) {
        appendQuickBuildingActions(uiOverlayLayer, card, cell);
        appendQuickPlacementCancel(uiOverlayLayer, card, cell);
      }
    }

    const tokenType = resourceAssignments[cell.id];
    if (tokenType) {
      const sparseBonus = false;
      const prospectiveSparseUrbanId = prospectiveSparseUrbanForResourceTile(cell.id);
      const prospectiveSparseBonus = !!prospectiveSparseUrbanId;
      const icon = createSvgElement('image');
      icon.setAttribute('class', `resource-token resource-token-stacked${sparseBonus ? ' sparse-trade-resource' : ''}${prospectiveSparseBonus ? ' prospective-sparse-resource' : ''}`);
      icon.setAttribute('href', resourceAssets[tokenType]);
      icon.setAttribute('x', (cell.cx + 8).toFixed(2));
      icon.setAttribute('y', (cell.cy - 58).toFixed(2));
      icon.setAttribute('width', '38');
      icon.setAttribute('height', '38');
      if (sparseBonus || prospectiveSparseBonus) {
        icon.addEventListener('click', (event) => {
          event.stopPropagation();
          if (blockSetupMisclick('recurso')) return;
          if (prospectiveSparseBonus) openProspectiveSparseTradeInfo(prospectiveSparseUrbanId, setupState.placingPlayer);
          else openSparseTradeInfo(cell.id);
        });
      }
      group.appendChild(icon);
      if (sparseBonus || prospectiveSparseBonus) {
        const alert = createSvgElement('text');
        alert.setAttribute('class', `sparse-trade-alert${prospectiveSparseBonus ? ' prospective-sparse-resource-alert' : ''}`);
        alert.setAttribute('x', (cell.cx + 43).toFixed(2));
        alert.setAttribute('y', (cell.cy - 49).toFixed(2));
        alert.textContent = '!';
        alert.addEventListener('click', (event) => {
          event.stopPropagation();
          if (blockSetupMisclick('recurso')) return;
          if (prospectiveSparseBonus) openProspectiveSparseTradeInfo(prospectiveSparseUrbanId, setupState.placingPlayer);
          else openSparseTradeInfo(cell.id);
        });
        group.appendChild(alert);
      }
    }

    const unit = placedUnits[cell.id];
    if (unit) {
      const handleUnitSelect = (event) => {
        event.stopPropagation();
        selectedId = cell.id;
        document.querySelectorAll('.hex-group').forEach(group => { group.classList.toggle('selected', group.dataset.id === cell.id); });
        renderTileInfoForCell(cell);
        renderUnitCard(cell.id);
        clearInfluence();
      };

      const unitHit = createSvgElement('circle');
      unitHit.setAttribute('class', 'unit-token-hitbox');
      unitHit.setAttribute('cx', (cell.cx - 28).toFixed(2));
      unitHit.setAttribute('cy', (cell.cy - 38).toFixed(2));
      unitHit.setAttribute('r', '24');
      unitHit.addEventListener('click', handleUnitSelect);
      group.appendChild(unitHit);

      const unitIcon = createSvgElement('image');
      unitIcon.setAttribute('class', 'unit-token unit-token-stacked');
      unitIcon.setAttribute('href', unit.type === 'villager' ? villagerAsset(unit.owner) : unitTokenAsset(unit.type, unit.owner));
      unitIcon.setAttribute('x', (cell.cx - 48).toFixed(2));
      unitIcon.setAttribute('y', (cell.cy - 58).toFixed(2));
      unitIcon.setAttribute('width', '40');
      unitIcon.setAttribute('height', '40');
      unitIcon.addEventListener('click', handleUnitSelect);
      group.appendChild(unitIcon);

      if (unit.type === 'villager') {
        const totalCount = unit.count || 1;
        const activeCount = getActiveVillagersOnTile(cell.id);
        const pendingCount = Math.max(0, totalCount - activeCount);
        const displayCount = pendingCount > 0 ? activeCount : totalCount;

        if (pendingCount > 0) {
          const pendingCircle = createSvgElement('circle');
          pendingCircle.setAttribute('class', `villager-pending-badge badge-${unit.owner}`);
          pendingCircle.setAttribute('cx', (cell.cx - 28).toFixed(2));
          pendingCircle.setAttribute('cy', (cell.cy - 38).toFixed(2));
          pendingCircle.setAttribute('r', '14');
          group.appendChild(pendingCircle);

          const pendingText = createSvgElement('text');
          pendingText.setAttribute('class', 'villager-pending-text');
          pendingText.setAttribute('x', (cell.cx - 28).toFixed(2));
          pendingText.setAttribute('y', (cell.cy - 33).toFixed(2));
          pendingText.textContent = '⏳';
          group.appendChild(pendingText);
        }

        const shouldShowCount = (pendingCount > 0 && displayCount > 0) || (pendingCount === 0 && displayCount > 1);
        if (shouldShowCount) {
          const badgeCircle = createSvgElement('circle');
          badgeCircle.setAttribute('class', `villager-count-badge badge-${unit.owner}`);
          badgeCircle.setAttribute('cx', (cell.cx - 12).toFixed(2));
          badgeCircle.setAttribute('cy', (cell.cy - 20).toFixed(2));
          badgeCircle.setAttribute('r', '10');
          group.appendChild(badgeCircle);

          const badgeText = createSvgElement('text');
          badgeText.setAttribute('class', 'villager-count-text');
          badgeText.setAttribute('x', (cell.cx - 12).toFixed(2));
          badgeText.setAttribute('y', (cell.cy - 16).toFixed(2));
          badgeText.textContent = displayCount;
          group.appendChild(badgeText);
        }
      }
    }

    if (placementConfirm && placementConfirm.tileId === cell.id && quickCreatableTypes.includes(placementMode?.type)) {
      const confirmGroup = createSvgElement('g');
      confirmGroup.setAttribute('class', 'quick-create-confirm');
      confirmGroup.setAttribute('transform', `translate(${(cell.cx + 10).toFixed(2)}, ${(cell.cy - 20).toFixed(2)})`);

      const createGroup = createSvgElement('g');
      createGroup.setAttribute('class', 'quick-create-button quick-create-yes');
      createGroup.addEventListener('click', (event) => {
        event.stopPropagation();
        confirmPlacement(cell.id);
      });
      const createRect = createSvgElement('rect');
      createRect.setAttribute('x', '0');
      createRect.setAttribute('y', '0');
      createRect.setAttribute('width', '58');
      createRect.setAttribute('height', '24');
      createRect.setAttribute('rx', '8');
      createGroup.appendChild(createRect);
      const createText = createSvgElement('text');
      createText.setAttribute('x', '29');
      createText.setAttribute('y', '16');
      createText.textContent = 'Crear';
      createGroup.appendChild(createText);
      confirmGroup.appendChild(createGroup);

      const cancelGroup = createSvgElement('g');
      cancelGroup.setAttribute('class', 'quick-create-button quick-create-no');
      cancelGroup.setAttribute('transform', 'translate(62, 0)');
      cancelGroup.addEventListener('click', (event) => {
        event.stopPropagation();
        cancelPlacementConfirm();
      });
      const cancelRect = createSvgElement('rect');
      cancelRect.setAttribute('x', '0');
      cancelRect.setAttribute('y', '0');
      cancelRect.setAttribute('width', '68');
      cancelRect.setAttribute('height', '24');
      cancelRect.setAttribute('rx', '8');
      cancelGroup.appendChild(cancelRect);
      const cancelText = createSvgElement('text');
      cancelText.setAttribute('x', '34');
      cancelText.setAttribute('y', '16');
      cancelText.textContent = 'No crear';
      cancelGroup.appendChild(cancelText);
      confirmGroup.appendChild(cancelGroup);

      uiOverlayLayer.appendChild(confirmGroup);
    }

  cellLayer.appendChild(group);
});

  vertices.forEach(point => {
    const isValidMoveTarget = movementMode && movementMode.validPointIds?.includes(point.id);
    const unit = getPointUnit(point.id);
    const dot = createSvgElement('circle');
    dot.setAttribute('class', `move-point${isValidMoveTarget ? ' move-point-valid' : ''}${selectedPointId === point.id ? ' move-point-selected' : ''}`);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
    dot.setAttribute('r', point.linkedCells.length >= 3 ? '5.8' : '5.2');
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      if (movementMode?.type === 'placeDaimyo') {
        if (placeInitialDaimyoAtPoint(point.id)) return;
        addLog(`Debes colocar el Daimio de ${playerState[movementMode.player].name} en uno de los puntos marcados.`, 'warn');
        return;
      }
      if (setupState.active && placementMode?.setupPlacement) {
        addLog(`Debes colocar el Aldeano inicial de ${playerState[placementMode.player].name} antes de continuar.`, 'warn');
        return;
      }
      if (setupState.active) return;
      document.querySelectorAll('.hex-group').forEach(group => group.classList.remove('selected'));
      selectedId = null;
      clearInfluence();
      if (movementMode?.type === 'placeMilitaryUnit' && placeMilitaryUnitAtPoint(point.id)) return;
      if (movementMode?.type === 'moveDaimyo' && moveDaimyoToPoint(point.id)) return;
      if (movementMode?.type === 'movePointUnit' && movePointUnitToPoint(point.id)) return;
      selectedPointId = point.id;
      drawBoard();
      renderTileInfoForPoint(point);
      if (unit?.type === 'daimyo') renderDaimyoCard(point.id);
      else if (unit) renderMilitaryPointUnitCard(point.id);
    });
    pointLayer.appendChild(dot);

    if (unit) {
      const unitShadow = createSvgElement('circle');
      unitShadow.setAttribute('class', 'point-unit-shadow');
      unitShadow.setAttribute('cx', point.x);
      unitShadow.setAttribute('cy', point.y + 13);
      unitShadow.setAttribute('r', '12');
      pointLayer.appendChild(unitShadow);

      const unitIcon = createSvgElement('image');
      unitIcon.setAttribute('class', 'point-unit-icon');
      unitIcon.setAttribute('href', unit.type === 'daimyo' ? daimyoAsset(unit.owner) : unitTokenAsset(unit.type, unit.owner));
      unitIcon.setAttribute('x', (point.x - 22).toFixed(2));
      unitIcon.setAttribute('y', (point.y - 42).toFixed(2));
      unitIcon.setAttribute('width', '44');
      unitIcon.setAttribute('height', '56');
      unitIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (blockSetupMisclick('unidad')) return;
        document.querySelectorAll('.hex-group').forEach(group => group.classList.remove('selected'));
        selectedId = null;
        clearInfluence();
        selectedPointId = point.id;
        drawBoard();
        renderTileInfoForPoint(point);
        if (unit.type === 'daimyo') renderDaimyoCard(point.id);
        else renderMilitaryPointUnitCard(point.id);
      });
      pointLayer.appendChild(unitIcon);

      if ((unit.readyTurnSerial || 0) > turnSerial) {
        const waitCircle = createSvgElement('circle');
        waitCircle.setAttribute('class', `daimyo-pending-badge badge-${unit.owner}`);
        waitCircle.setAttribute('cx', point.x.toFixed(2));
        waitCircle.setAttribute('cy', (point.y - 14).toFixed(2));
        waitCircle.setAttribute('r', '13');
        pointLayer.appendChild(waitCircle);

        const waitText = createSvgElement('text');
        waitText.setAttribute('class', 'daimyo-pending-text');
        waitText.setAttribute('x', point.x.toFixed(2));
        waitText.setAttribute('y', (point.y - 9).toFixed(2));
        waitText.textContent = '⏳';
        pointLayer.appendChild(waitText);
      }

      if (selectedPointId === point.id && !movementMode) {
        const canQuickMove = !setupState.active && canCurrentPlayerActAs(unit.owner) && (unit.type === 'daimyo' ? canDaimyoMoveNow(unit) : canPointUnitMoveNow(unit));
        const canQuickDeal = unit.type === 'daimyo' && !setupState.active && canCurrentPlayerActAs(unit.owner) && getNegotiableBuildingsForDaimyo(point.id, unit.owner).length > 0;
        const quickItems = [];
        if (canQuickMove) quickItems.push({ label: 'Mover', action: () => unit.type === 'daimyo' ? beginDaimyoMove(point.id) : beginPointUnitMove(point.id), cls: 'quick-move-button' });
        if (canQuickDeal) quickItems.push({ label: 'Negociar', action: () => openDaimyoDealMenu(point.id), cls: 'quick-deal-button' });

        quickItems.forEach((item, index) => {
          const quickGroup = createSvgElement('g');
          quickGroup.setAttribute('class', item.cls);
          quickGroup.setAttribute('transform', `translate(${(point.x + 21).toFixed(2)}, ${(point.y - 23 + index * 30).toFixed(2)})`);
          quickGroup.addEventListener('click', (event) => {
            event.stopPropagation();
            item.action();
          });

          const quickRect = createSvgElement('rect');
          quickRect.setAttribute('x', '0');
          quickRect.setAttribute('y', '0');
          quickRect.setAttribute('width', item.label === 'Negociar' ? '76' : '62');
          quickRect.setAttribute('height', '26');
          quickRect.setAttribute('rx', '9');
          quickGroup.appendChild(quickRect);

          const quickText = createSvgElement('text');
          quickText.setAttribute('x', item.label === 'Negociar' ? '38' : '31');
          quickText.setAttribute('y', '17');
          quickText.textContent = item.label;
          quickGroup.appendChild(quickText);
          pointLayer.appendChild(quickGroup);
        });
      }
    }
  });

  boardSvg.appendChild(cellLayer);
  boardSvg.appendChild(pointLayer);
  boardSvg.appendChild(uiOverlayLayer);
}



function updateSeasonBoardImage() {
  const background = document.querySelector('.background-layer');
  const seasonName = seasons[currentSeasonIndex];
  const nextSrc = seasonBoardAssets[seasonName] || 'assets/board/map-background.png';
  if (background && background.getAttribute('src') !== nextSrc) {
    background.setAttribute('src', nextSrc);
  }
}

function updateTurnHud() {
  const playerLabel = document.getElementById('turnPlayerLabel');
  const yearLabel = document.getElementById('yearLabel');
  const seasonLabel = document.getElementById('seasonLabel');
  if (playerLabel) playerLabel.textContent = playerState[currentPlayer].name;
  if (yearLabel) yearLabel.textContent = currentYear;
  if (seasonLabel) seasonLabel.textContent = seasons[currentSeasonIndex];
  updateSeasonBoardImage();
}


function applyVillagerTurnIncome(player) {
  const state = playerState[player];
  if (!state) return;
  const key = seasonKey();
  if (state.lastVillagerIncomeSeason === key) return;

  let immediate = {};
  Object.entries(placedUnits).forEach(([tileId, unit]) => {
    if (!unit || unit.owner !== player || unit.type !== 'villager') return;
    const resourceType = unit.gathers || resourceAssignments[tileId];
    if (!resourceType) return;
    const workerCount = getActiveVillagersOnTile(tileId);
    if (workerCount <= 0) return;
    const amount = 2 * workerCount;
    const card = playerBuildingCards[tileId];
    if (card?.buildingKind === 'extraction') {
      state.resourceConvoys = state.resourceConvoys || [];
      const delay = card.transportDelay || extractionDelayForTile(player, tileId);
      state.resourceConvoys.push({ tileId, type: resourceType, amount, remaining: delay });
      addLog(`${playerState[player].name}: ${card.name} envía ${resourceNames[resourceType]} en caravana. Llegará en ${delay} turno${delay > 1 ? 's' : ''}.`, player);
      showResourceBubble(tileId, { [resourceType]: amount });
    } else {
      immediate[resourceType] = (immediate[resourceType] || 0) + amount;
      showResourceBubble(tileId, { [resourceType]: amount });
    }
  });

  const arriving = {};
  state.resourceConvoys = (state.resourceConvoys || []).map(convoy => ({ ...convoy, remaining: convoy.remaining - 1 })).filter(convoy => {
    if (convoy.remaining <= 0) {
      arriving[convoy.type] = (arriving[convoy.type] || 0) + convoy.amount;
      showResourceBubble(convoy.tileId, { [convoy.type]: convoy.amount });
      return false;
    }
    return true;
  });

  state.lastVillagerIncomeSeason = key;
  const gained = { ...immediate };
  Object.entries(arriving).forEach(([type, amount]) => gained[type] = (gained[type] || 0) + amount);

  Object.entries(gained).forEach(([type, amount]) => {
    state.resources[type] = (state.resources[type] || 0) + amount;
  });

  if (Object.keys(gained).length) {
    addLog(`${playerState[player].name} recibe recursos: ${resourceGainText(gained)}.`, player);
    renderHud();
  } else {
    addLog(`${playerState[player].name} no tiene aldeanos activos recolectando en este turno.`, player);
  }
}


function addCosts(target, cost, multiplier = 1) {
  Object.entries(cost || {}).forEach(([type, amount]) => {
    target[type] = (target[type] || 0) + amount * multiplier;
  });
  return target;
}

function annualTaxBreakdownForPlayer(player) {
  const sources = [];
  Object.values(playerBuildingCards).forEach(card => {
    if (!card || card.owner !== player || !isCardOperational(card)) return;
    if (hasResourceEntries(card.annualMaintenanceCost || {})) sources.push({ label: card.name || 'Edificio', cost: cloneResourceCounts(card.annualMaintenanceCost) });
  });
  Object.values(buildingCards).forEach(card => {
    if (!card || card.owner !== player || !isCardOperational(card)) return;
    if (hasResourceEntries(card.annualContractTax || {})) sources.push({ label: card.name || 'Contrato comercial', cost: cloneResourceCounts(card.annualContractTax) });
  });
  Object.entries(placedUnits).forEach(([tileId, unit]) => {
    if (!unit || unit.owner !== player || unit.type !== 'villager') return;
    const activeWorkers = getActiveVillagersOnTile(tileId);
    if (activeWorkers <= 0) return;
    sources.push({ label: `Aldeano${activeWorkers > 1 ? ` x${activeWorkers}` : ''} en ${tileId}`, cost: { food: activeWorkers } });
  });
  return sources;
}

function sumDebtSources(sources = []) {
  const taxes = emptyResourceCounts();
  sources.forEach(source => addCosts(taxes, source.cost || source.resources || {}));
  return taxes;
}

function annualTaxForPlayer(player) {
  return sumDebtSources(annualTaxBreakdownForPlayer(player));
}


function openDebtResolution(player, taxes, options = {}) {
  const state = normalizeDebtState(player);
  const currentTaxes = cloneResourceCounts(taxes || {});
  const taxSources = options.sources || annualTaxBreakdownForPlayer(player);
  const previousDebt = cloneResourceCounts(state.debtLedger || {});
  const totalDue = combinedDebtAndTaxes(player, currentTaxes);
  if (!hasResourceEntries(totalDue) && !options.forceShow) return Promise.resolve();

  currentDebtResolution = {
    player,
    taxes: currentTaxes,
    previousDebt,
    due: totalDue,
    pay: emptyResourceCounts(),
    totalOwed: resourceMapTotal(totalDue),
    noDebt: !hasResourceEntries(totalDue),
    overdue: resourceMapTotal(previousDebt) > 0 && (state.debtAge || 0) >= 1,
    manual: !!options.manual,
    sources: taxSources
  };

  return new Promise(resolve => {
    debtResolutionResolver = resolve;
    renderDebtResolutionCard();
  });
}

function finalizeDebtResolution() {
  const resolver = debtResolutionResolver;
  currentDebtResolution = null;
  debtResolutionResolver = null;
  hideFrontModal({ force: true });
  clearActionCard();
  if (typeof resolver === 'function') resolver();
}

function renderDebtResolutionCard() {
  if (!currentDebtResolution) return;
  const { player, due, pay, totalOwed, overdue, previousDebt, taxes, sources, manual, noDebt } = currentDebtResolution;
  const state = normalizeDebtState(player);
  const available = state.resources;
  const totalSelected = resourceMapTotal(pay);
  const canConfirm = totalSelected > 0 && totalSelected <= totalOwed;
  const overdueHtml = overdue
    ? `<p class="mini-note debt-warning">Tienes deuda acumulada del año anterior. Si no liquidas todo ahora, perderás <strong>todos</strong> tus recursos y la deuda quedará saldada.</p>`
    : `<p class="mini-note">Puedes pagar tu deuda/impuestos con cualquier mezcla de recursos <strong>1 a 1</strong>. Si no quieres o no puedes pagar este año, puedes acumular la deuda hasta el próximo Año.</p>`;

  if (noDebt) {
    const bodyHtml = `
      <article class="floating-card ${ownerClass(player)} debt-front-card">
        <div class="floating-card-bg" style="background-image:url('assets/cards/debt-council-bg.png')"></div>
        <div class="floating-card-content">
          <header class="floating-card-header">
            <div class="floating-card-title-box">
              <h3>Revisión de Impuestos</h3>
              <p>${playerState[player].name} · Año ${currentYear}</p>
            </div>
            <div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div>
          </header>
          <footer class="floating-card-footer debt-modal-body">
            <p class="mini-note">Este jugador fue revisado y no tiene impuestos ni deuda estatal pendiente este año.</p>
            <div class="debt-block">
              <h3>Fuentes revisadas</h3>
              <div class="debt-breakdown debt-source-list">
                ${debtSourcesHtml(sources)}
                <span><strong>Suma total del año:</strong> ${debtResourceHtml(taxes)}</span>
              </div>
            </div>
            <button class="create-button" onclick="continueDebtReview()">Continuar</button>
          </footer>
        </div>
      </article>`;
    openFrontModal({
      mode: 'debt',
      title: 'Revisión de Impuestos',
      subtitle: `${playerState[player].name} · Año ${currentYear}`,
      bodyHtml,
      closable: false,
      bodyClass: 'card-modal-body single-front-card-body'
    });
    return;
  }

  const bodyHtml = `
    <article class="floating-card ${ownerClass(player)} debt-front-card">
      <div class="floating-card-bg" style="background-image:url('assets/cards/debt-council-bg.png')"></div>
      <div class="floating-card-content">
        <header class="floating-card-header">
          <div class="floating-card-title-box">
            <h3>Resolución de Impuestos</h3>
            <p>${playerState[player].name} · Año ${currentYear}</p>
          </div>
          <div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div>
        </header>
        <footer class="floating-card-footer debt-modal-body">
          ${overdueHtml}
          <div class="debt-block">
            <h3>Recursos que debes</h3>
            <div class="debt-chip-list">${debtResourceHtml(due)}</div>
            <div class="debt-breakdown debt-source-list">
              ${debtSourcesHtml(sources)}
              ${resourceMapTotal(previousDebt) > 0 ? `<span><strong>Deuda acumulada:</strong> ${debtResourceHtml(previousDebt)}</span>` : ''}
              <span><strong>Suma total del año:</strong> ${debtResourceHtml(taxes)}</span>
            </div>
          </div>
          <div class="debt-block">
            <h3>Cómo quieres pagarlo</h3>
            <div class="trade-give-rows debt-pay-rows">
              ${resourceTypes.map(type => debtPayRow(type, available[type] || 0, pay[type] || 0)).join('')}
            </div>
          </div>
          <div class="trade-summary debt-summary">
            Debes <strong>${totalOwed}</strong> recursos en total. Has seleccionado <strong>${totalSelected}/${totalOwed}</strong>. Puedes pagar todo o hacer un abono parcial.
          </div>
          <div class="trade-action-row"><button class="create-button compact-confirm ${canConfirm ? '' : 'locked-button'}" ${canConfirm ? '' : 'disabled'} onclick="confirmDebtPayment()">Confirmar pago / abono</button><button class="trade-open-button quick-trade-btn" onclick="calculateQuickDebtPayment()">Calcular pago rápido</button></div>
          <button class="cancel-button" onclick="accumulateDebtDecision()">${overdue ? 'No puedo pagar / perder recursos' : 'Acumular la deuda'}</button>
        </footer>
      </div>
    </article>`;

  openFrontModal({
    mode: 'debt',
    title: 'Resolución de Impuestos',
    subtitle: `${playerState[player].name} · Año ${currentYear}`,
    bodyHtml,
    closable: false,
    bodyClass: 'card-modal-body single-front-card-body'
  });
}


function preserveDebtScroll(renderFn) {
  const scroller = document.querySelector('.front-modal-body') || document.querySelector('.debt-modal-body');
  const top = scroller ? scroller.scrollTop : 0;
  renderFn();
  requestAnimationFrame(() => {
    const next = document.querySelector('.front-modal-body') || document.querySelector('.debt-modal-body');
    if (next) next.scrollTop = top;
  });
}

function continueDebtReview() {
  finalizeDebtResolution();
}

function calculateQuickDebtPayment() {
  if (!currentDebtResolution) return;
  const state = normalizeDebtState(currentDebtResolution.player);
  const available = state.resources;
  currentDebtResolution.pay = emptyResourceCounts();
  let remaining = Math.min(currentDebtResolution.totalOwed, resourceMapTotal(available));
  while (remaining > 0) {
    const candidates = resourceTypes
      .filter(type => (available[type] || 0) > (currentDebtResolution.pay[type] || 0))
      .sort((a, b) => {
        const netA = (available[a] || 0) - (currentDebtResolution.pay[a] || 0);
        const netB = (available[b] || 0) - (currentDebtResolution.pay[b] || 0);
        if (netB !== netA) return netB - netA;
        const priority = { metal: 0, stone: 1, gold: 2, wood: 3, food: 4 };
        return (priority[a] ?? 9) - (priority[b] ?? 9);
      });
    if (!candidates.length) break;
    currentDebtResolution.pay[candidates[0]] = (currentDebtResolution.pay[candidates[0]] || 0) + 1;
    remaining -= 1;
  }
  preserveDebtScroll(() => renderDebtResolutionCard());
}

function changeDebtPayment(type, delta) {
  if (!currentDebtResolution) return;
  const state = normalizeDebtState(currentDebtResolution.player);
  const available = state.resources[type] || 0;
  const current = currentDebtResolution.pay[type] || 0;
  const totalSelected = resourceMapTotal(currentDebtResolution.pay);
  const maxNeededForType = currentDebtResolution.totalOwed - (totalSelected - current);
  if (delta > 0 && totalSelected >= currentDebtResolution.totalOwed) return;
  let next = Math.max(0, Math.min(available, current + delta));
  if (delta > 0) next = Math.min(next, maxNeededForType);
  currentDebtResolution.pay[type] = next;
  preserveDebtScroll(() => renderDebtResolutionCard());
}

function confirmDebtPayment() {
  if (!currentDebtResolution) return;
  const { player, pay, totalOwed, due } = currentDebtResolution;
  const state = normalizeDebtState(player);
  const totalSelected = resourceMapTotal(pay);
  if (totalSelected <= 0 || totalSelected > totalOwed) {
    addLog(`Selecciona entre 1 y ${totalOwed} recursos para pagar o abonar.`, 'warn');
    return;
  }
  if (!canAfford(player, pay)) { addLog('No tienes suficientes recursos para ese pago.', 'warn'); return; }
  resourceTypes.forEach(type => {
    const amount = pay[type] || 0;
    if (amount > 0) state.resources[type] = Math.max(0, (state.resources[type] || 0) - amount);
  });
  if (totalSelected >= totalOwed) {
    clearDebtState(player);
    addLog(`${playerState[player].name} salda toda su deuda/impuestos usando ${resourceGainText(pay).replace(/\+/g, '-')}.`, player);
  } else {
    const remainingDebt = subtractDebtByValue(due, totalSelected);
    setDebtState(player, remainingDebt, Math.max(1, state.debtAge || 1));
    addLog(`${playerState[player].name} hace un abono de ${totalSelected}. Deuda restante: ${resourceGainText(remainingDebt).replace(/\+/g, '-')}.`, 'warn');
  }
  renderHud();
  finalizeDebtResolution();
}

function accumulateDebtDecision() {
  if (!currentDebtResolution) return;
  const { player, due, overdue } = currentDebtResolution;
  const state = normalizeDebtState(player);
  if (overdue) {
    resourceTypes.forEach(type => { state.resources[type] = 0; });
    clearDebtState(player);
    addLog(`${playerState[player].name} no pudo pagar su deuda acumulada. Pierde todos sus recursos y la deuda queda saldada.`, 'warn');
  } else {
    setDebtState(player, due, 1);
    addLog(`${playerState[player].name} acumula deuda para el próximo Año: ${resourceGainText(due).replace(/\+/g, '-')}.`, 'warn');
  }
  renderHud();
  finalizeDebtResolution();
}

function openManualDebtPayment(player = currentPlayer) {
  const state = normalizeDebtState(player);
  if (!state || !hasResourceEntries(state.debtLedger)) {
    addLog('No tienes deuda estatal pendiente para pagar ahora.', 'warn');
    return;
  }
  openDebtResolution(player, {}, { manual: true, sources: [] });
}

async function resolveAnnualDebtPhase() {
  const annualDebtChecks = ['blue', 'red'].map(player => {
    const sources = annualTaxBreakdownForPlayer(player);
    const taxes = sumDebtSources(sources);
    const state = normalizeDebtState(player);
    const totalDue = combinedDebtAndTaxes(player, taxes);
    return { player, sources, taxes, totalDue, previousDebt: cloneResourceCounts(state.debtLedger || {}) };
  });

  for (const check of annualDebtChecks) {
    const total = resourceMapTotal(check.totalDue);
    addLog(`Revisión fiscal de ${playerState[check.player].name}: ${total > 0 ? resourceGainText(check.totalDue).replace(/\+/g, '-') : 'sin impuestos/deuda pendiente'}.`, check.player);
    await openDebtResolution(check.player, check.taxes, {
      sources: check.sources,
      forceShow: true
    });
  }
}

function applyBuildingYearIncome(player) {
  let gained = {};
  const entries = [];
  const ownedCards = [
    ...Object.values(buildingCards),
    ...Object.values(playerBuildingCards)
  ].filter(card => card && card.owner === player && isCardOperational(card) && card.annualBenefit && Object.keys(card.annualBenefit).length);

  ownedCards.forEach(card => {
    const benefit = {};
    Object.entries(card.annualBenefit || {}).forEach(([type, amount]) => {
      const bonus = card.monopolyOwner === player && !card.monopolyPending && card.monopolyResource === type ? 1 : 0;
      const total = amount + bonus;
      benefit[type] = (benefit[type] || 0) + total;
      gained[type] = (gained[type] || 0) + total;
    });
    if (Object.keys(benefit).length) {
      const icon = card.category ? (categoryAssets[card.category] || categoryAssets.civil) : categoryAssets.civil;
      entries.push({ player, cardName: card.name || card.title || 'Edificio', tileId: card.tileId || '', icon, benefit });
    }
  });

  const networkBonus = marketNetworkAnnualBonus(player);
  Object.entries(networkBonus.gain || {}).forEach(([type, amount]) => {
    gained[type] = (gained[type] || 0) + amount;
  });
  entries.push(...(networkBonus.entries || []));

  Object.entries(gained).forEach(([type, amount]) => {
    playerState[player].resources[type] = (playerState[player].resources[type] || 0) + amount;
  });
  entries.forEach(entry => {
    const target = entry.tileId || Object.values(playerBuildingCards).find(card => card.owner === player && card.buildingKind === 'market')?.tileId;
    if (target) showResourceBubble(target, entry.benefit);
  });

  if (Object.keys(gained).length) {
    addLog(`${playerState[player].name} recibe producción anual de edificios: ${resourceGainText(gained)}.`, player);
    renderHud();
  }
  return { player, gained, entries };
}

function annualBenefitsSummaryHtml(results) {
  const rows = [];
  (results || []).forEach(result => {
    (result.entries || []).forEach(entry => rows.push(entry));
  });
  if (!rows.length) {
    return `<article class="floating-card debt-front-card">
      <div class="floating-card-content">
        <header class="floating-card-header"><div><h3>Beneficios anuales adquiridos</h3><p>No hubo producción anual de edificios.</p></div></header>
        <footer class="floating-card-footer"><button class="create-button" onclick="closeAnnualBenefitsSummary()">Continuar</button></footer>
      </div>
    </article>`;
  }
  return `<article class="floating-card debt-front-card annual-benefits-front-card">
    <div class="floating-card-bg" style="background-image:url('assets/cards/debt-council-bg.png')"></div>
    <div class="floating-card-content">
      <header class="floating-card-header">
        <div><h3>Beneficios anuales adquiridos</h3><p>Resumen de producción por edificio</p></div>
        <div class="floating-card-icon-box"><img class="floating-card-icon" src="${categoryAssets.economico}" alt="" /></div>
      </header>
      <footer class="floating-card-footer annual-benefit-summary">
        ${rows.map(entry => `<div class="annual-benefit-row ${ownerClass(entry.player)}">
          <img src="${entry.icon}" alt="" />
          <div class="annual-benefit-row-text">
            <strong>${playerState[entry.player].name} · ${entry.networkInfo ? `<button class="inline-info-link" onclick="openMarketNetworkInfo('${entry.player}')">${entry.cardName}</button>` : entry.cardName}${entry.tileId ? ` (${entry.tileId})` : ''}</strong>
            <span>${debtResourceHtml(entry.benefit)}</span>
          </div>
        </div>`).join('')}
        <button class="create-button" onclick="closeAnnualBenefitsSummary()">Continuar</button>
      </footer>
    </div>
  </article>`;
}


function restoreAnnualBenefitsSummary() {
  if (!lastAnnualBenefitResults) { hideFrontModal({ force: true }); return; }
  openFrontModal({
    mode: 'annualBenefits',
    title: 'Beneficios anuales adquiridos',
    subtitle: `Año ${currentYear}`,
    bodyHtml: annualBenefitsSummaryHtml(lastAnnualBenefitResults),
    closable: false,
    bodyClass: 'card-modal-body single-front-card-body'
  });
}

function showAnnualBenefitsSummary(results) {
  lastAnnualBenefitResults = results;
  return new Promise(resolve => {
    annualBenefitSummaryResolver = resolve;
    openFrontModal({
      mode: 'annualBenefits',
      title: 'Beneficios anuales adquiridos',
      subtitle: `Año ${currentYear}`,
      bodyHtml: annualBenefitsSummaryHtml(results),
      closable: false,
      bodyClass: 'card-modal-body single-front-card-body'
    });
  });
}

function closeAnnualBenefitsSummary() {
  const resolver = annualBenefitSummaryResolver;
  annualBenefitSummaryResolver = null;
  lastAnnualBenefitResults = null;
  marketNetworkMode = null;
  hideFrontModal({ force: true });
  if (typeof resolver === 'function') resolver();
}


function resourceGainText(gained) {
  return Object.entries(gained)
    .map(([type, amount]) => `+${amount} ${resourceNames[type]}`)
    .join(', ');
}

async function advanceTurn() {
  hideActionCardOnly();
  currentTrade = null;
  placementMode = null;
  placementConfirm = null;
  movementMode = null;
  marketNetworkMode = null;
  selectedId = null;
  selectedPointId = null;
  clearInfluence();
  currentPlayer = currentPlayer === 'blue' ? 'red' : 'blue';
  turnSerial += 1;
  const willAdvanceSeason = currentPlayer === 'blue';
  const willChangeYear = willAdvanceSeason && (currentSeasonIndex + 1 >= seasons.length);

  if (!willChangeYear) showTurnSweep(currentPlayer);

  if (currentPlayer === 'blue') {
    currentSeasonIndex += 1;

    if (currentSeasonIndex >= seasons.length) {
      await showYearEndSweep();
      currentSeasonIndex = 0;
      currentYear += 1;
      addLog(`Comienza el Año ${currentYear}.`, "gold");
      await runAnnualDiceFlow();
      processPendingActivationsOnSeasonChange();
      await resolveAnnualDebtPhase();
      const annualBenefitResults = [applyBuildingYearIncome('blue'), applyBuildingYearIncome('red')];
      await showAnnualBenefitsSummary(annualBenefitResults);
      await showInitialTradeProtectionExpired(protectionExpiryPlayers());
    } else {
      addLog(`Cambio de estación: ${seasons[currentSeasonIndex]}.`, "gold");
      processPendingActivationsOnSeasonChange();
    }
  }

  setActiveHudPlayer(currentPlayer);
  updateTurnHud();
  processPendingUnitActivationsForTurn(currentPlayer);
  applyVillagerTurnIncome(currentPlayer);
  addLog(`Turno de ${playerState[currentPlayer].name}. Estación: ${seasons[currentSeasonIndex]}.`, currentPlayer);
  drawBoard();
  if (willChangeYear) showTurnSweep(currentPlayer);
}

function startNewGame() {
  currentDebtResolution = null;
  debtResolutionResolver = null;
  annualBenefitSummaryResolver = null;
  lastAnnualBenefitResults = null;
  marketNetworkMode = null;
  hideFrontModal({ force: true });
  clearActionCard();
  resetLog();
  addLog('Nueva partida preparada.', 'gold');
  resetPlayerState();
  builtSpecialTiles.forEach(id => {
    const cell = getCellById(id);
    if (cell) cell.special = null;
  });
  builtSpecialTiles.clear();
  Object.keys(placedUnits).forEach(id => delete placedUnits[id]);
  currentPlayer = 'blue';
  currentYear = 1;
  currentSeasonIndex = 0;
  turnSerial = 0;
  playerState.blue.lastVillagerIncomeSeason = seasonKey();
  playerState.red.lastVillagerIncomeSeason = seasonKey();
  clearActionCard();
  setupState = {
    active: true,
    rolled: false,
    firstChooser: null,
    secondChooser: null,
    placingPlayer: null,
    firstSettlementTile: null,
    phase: 'roll',
    firstVillagerTile: null,
    secondVillagerTile: null,
    urbanPlaced: { blue: false, red: false },
    villagerPlaced: { blue: false, red: false },
    daimyoPlaced: { blue: false, red: false }
  };

  assignMaritimeMonopolies();
  assignPortAnnualBenefits();
  assignResources();
  selectedId = null;
  selectedPointId = null;
  movementMode = null;
  clearInfluence();
  closeCardInventory();
  renderHud();
  drawBoard();
  updateTurnHud();

  buildingCard.className = 'building-info-card empty-card';
  buildingCard.innerHTML = `<div class="empty-card-content"><h2>Sin selección</h2><p>Elige una casilla del tablero cuando quieras inspeccionarla.</p><p class="mini-note">Los edificios neutrales requieren Daimio/Diplomático para interactuar.</p></div>`;

  showSetupModal({
    title: 'Inicio de partida',
    text: 'Pulsa para iniciar la partida y comenzar la secuencia de dados.',
    buttonLabel: 'Iniciar partida',
    action: () => beginSetupRollFlow(),
    showDice: false,
    tone: 'gold'
  });
}

opacitySlider.addEventListener('input', () => { boardSvg.style.opacity = opacitySlider.value; opacityValue.textContent = Number(opacitySlider.value).toFixed(2); });
labelToggle.addEventListener('change', () => { boardSvg.classList.toggle('hide-labels', !labelToggle.checked); });
pointToggle.addEventListener('change', () => { boardSvg.classList.toggle('hide-points', !pointToggle.checked); });
newGameBtn.addEventListener('click', startNewGame);
buildNeighborMap();
initializeVertices();
startNewGame();

window.handleSetupPrimaryAction = handleSetupPrimaryAction;
