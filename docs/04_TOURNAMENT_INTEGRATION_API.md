# Especificación de Integración: API para el Gestor de Torneos Externo

Este documento define el contrato de datos (API REST y formato QR offline) para comunicar **Scanner de Beys** con el proyecto independiente del **Gestor de Torneos**.

---

## 1. Métodos de Conexión

Se prevén dos canales de transferencia para adaptarse a cualquier situación de red durante un torneo presencial:

1. **Canal A: API REST Directa (Online / Wi-Fi del Torneo)**
   * El jugador ingresa el código del torneo en la app móvil.
   * La app envía el payload del mazo directamente a los servidores del gestor de torneos.
2. **Canal B: Código QR Dinámico (Offline / Sin Cobertura)**
   * La app compila el mazo en un payload JSON comprimido en formato **Base64 + Gzip** y genera un código QR en pantalla.
   * El juez o mesa de control del torneo escanea el QR con su cámara y carga el mazo del jugador en el sistema del torneo de forma instantánea.

---

## 2. Esquema del Payload de Exportación (Formato 3on3 Oficial)

```json
{
  "$schema": "https://beyblade-x-app.org/schemas/deck-export-v1.json",
  "version": "1.0.0",
  "export_timestamp": "2026-10-21T18:45:00Z",
  "player": {
    "app_user_id": "usr_99a812bf-4122-47e2-8921-2a13b0c822e1",
    "player_handle": "ValtAoi_Latam",
    "verified_inventory": true
  },
  "tournament_reference": {
    "tournament_id": "tourn_c102",
    "registration_token": "REG-88219"
  },
  "deck_format": "3ON3_NO_REPEAT",
  "deck_validation": {
    "is_legal": true,
    "unique_blades_verified": true,
    "unique_ratchets_verified": true,
    "unique_bits_verified": true
  },
  "beys": [
    {
      "slot": 1,
      "custom_label": "Primer Atacante",
      "blade": {
        "master_code": "UX-01",
        "name": "Dran Buster",
        "system": "UX",
        "variant_id": "var_8812a",
        "colorway": "Black Ver. (CoroCoro Exclusive)",
        "brand": "TAKARA_TOMY",
        "spin_direction": "RIGHT",
        "weight_grams": 37.85
      },
      "ratchet": {
        "master_code": "1-60",
        "name": "1-60",
        "variant_id": "var_rat_0160_bk",
        "sides": 1,
        "height_mm": 60,
        "weight_grams": 6.20
      },
      "bit": {
        "master_code": "F",
        "name": "Flat",
        "variant_id": "var_bit_flat_clr",
        "category": "Attack",
        "burst_resistance_tier": "HIGH",
        "weight_grams": 2.15
      },
      "calculated_total_weight_grams": 46.20,
      "composite_stats": {
        "attack": 85,
        "defense": 20,
        "stamina": 25,
        "dash": 90,
        "burst_resistance": 80
      }
    },
    {
      "slot": 2,
      "custom_label": "Estamina Principal",
      "blade": {
        "master_code": "UX-03",
        "name": "Wizard Rod",
        "system": "UX",
        "variant_id": "var_wzrd_ylw",
        "colorway": "Yellow Standard",
        "brand": "TAKARA_TOMY",
        "spin_direction": "RIGHT",
        "weight_grams": 35.10
      },
      "ratchet": {
        "master_code": "9-60",
        "name": "9-60",
        "variant_id": "var_rat_0960_grn",
        "sides": 9,
        "height_mm": 60,
        "weight_grams": 6.45
      },
      "bit": {
        "master_code": "B",
        "name": "Ball",
        "variant_id": "var_bit_ball_trans",
        "category": "Stamina",
        "burst_resistance_tier": "NORMAL",
        "weight_grams": 2.20
      },
      "calculated_total_weight_grams": 43.75,
      "composite_stats": {
        "attack": 25,
        "defense": 70,
        "stamina": 95,
        "dash": 35,
        "burst_resistance": 50
      }
    },
    {
      "slot": 3,
      "custom_label": "Tanque Pesado",
      "blade": {
        "master_code": "BX-23",
        "name": "Phoenix Wing",
        "system": "BX",
        "variant_id": "var_phnx_red",
        "colorway": "Painted Metallic Red",
        "brand": "TAKARA_TOMY",
        "spin_direction": "RIGHT",
        "weight_grams": 38.20
      },
      "ratchet": {
        "master_code": "5-60",
        "name": "5-60",
        "variant_id": "var_rat_0560_rd",
        "sides": 5,
        "height_mm": 60,
        "weight_grams": 6.35
      },
      "bit": {
        "master_code": "GF",
        "name": "Gear Flat",
        "variant_id": "var_bit_gf_red",
        "category": "Attack / Dash",
        "burst_resistance_tier": "HIGH",
        "weight_grams": 2.25
      },
      "calculated_total_weight_grams": 46.80,
      "composite_stats": {
        "attack": 90,
        "defense": 55,
        "stamina": 40,
        "dash": 95,
        "burst_resistance": 80
      }
    }
  ]
}
```

---

## 3. Endpoints del Gestor de Torneos

### Endpoint 1: Validación y Registro de Mazo
* **Ruta:** `POST /api/v1/tournaments/{tournament_id}/register-deck`
* **Cabeceras:** `Content-Type: application/json`, `X-App-Signature: [HMAC_SHA256]`
* **Respuestas esperadas:**
  * `201 Created`: Mazo registrado correctamente y jugador asignado a la fase de emparejamientos.
  * `422 Unprocessable Entity`: Violación de reglas competitivas (ejemplo: repetición de Ratchet o Bit en más de un Bey).

### Endpoint 2: Consulta del Metagame y Estadísticas (Feedback hacia la App)
Para que la app de escáner muestre a los jugadores qué piezas tienen mejor rendimiento en los torneos en vivo:
* **Ruta:** `GET /api/v1/meta/parts-winrates`
* **Respuesta:**
  ```json
  {
    "updated_at": "2026-10-21T18:00:00Z",
    "top_performing_blades": [
      { "master_code": "UX-03", "name": "Wizard Rod", "pick_rate_pct": 82.4, "win_rate_pct": 64.1 },
      { "master_code": "BX-23", "name": "Phoenix Wing", "pick_rate_pct": 74.0, "win_rate_pct": 59.8 },
      { "master_code": "UX-01", "name": "Dran Buster", "pick_rate_pct": 68.2, "win_rate_pct": 57.2 }
    ]
  }
  ```
