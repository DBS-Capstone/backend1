# Kicau Finder API Documentation

## Overview

This API provides endpoints for detecting and identifying bird species from audio recordings using machine learning. The backend is built with JavaScript and supports real-time audio processing and bird species classification.

**Base URL:** `https://api.kicaufinder.com/v1`

**Authentication:** Bearer Token required for all endpoints

## Authentication

Include your API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Audio Processing

#### Upload Audio for Bird Detection

**POST** `/detect`

Uploads an audio file and returns bird species detection results.

**Request:**
- Content-Type: `multipart/form-data`
- Max file size: 10MB
- Supported formats: WAV, MP3, FLAC, OGG

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audio` | File | Yes | Audio file containing bird sounds |
| `confidence_threshold` | Number | No | Minimum confidence score (0.0-1.0, default: 0.7) |
| `max_results` | Number | No | Maximum number of results to return (default: 5) |
| `include_timestamps` | Boolean | No | Include time segments in response (default: false) |

**Example Request:**
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('confidence_threshold', 0.8);
formData.append('max_results', 3);

fetch('/api/v1/detect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "processing_time": 2.34,
  "file_info": {
    "filename": "bird_recording.wav",
    "duration": 15.6,
    "sample_rate": 44100,
    "format": "wav"
  },
  "detections": [
    {
      "species": "American Robin",
      "scientific_name": "Turdus migratorius",
      "confidence": 0.92,
      "common_names": ["American Robin", "Robin"],
      "family": "Turdidae",
      "timestamps": [
        {
          "start": 2.3,
          "end": 4.7,
          "confidence": 0.92
        }
      ]
    }
  ],
  "metadata": {
    "model_version": "v2.1.0",
    "total_detections": 1,
    "processing_date": "2024-05-22T10:30:00Z"
  }
}
```

#### Real-time Audio Stream Detection

**POST** `/detect/stream`

Processes audio stream in real-time for live bird detection.

**Request:**
- Content-Type: `application/octet-stream`
- WebSocket connection for continuous streaming

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sample_rate` | Number | Yes | Audio sample rate in Hz |
| `channels` | Number | No | Number of audio channels (default: 1) |
| `chunk_duration` | Number | No | Processing chunk duration in seconds (default: 3) |

**WebSocket URL:** `wss://api.kicaufinder.com/v1/detect/stream`

**Response (Streaming):**
```json
{
  "type": "detection",
  "timestamp": "2024-05-22T10:30:15Z",
  "detections": [
    {
      "species": "House Sparrow",
      "confidence": 0.85,
      "start_time": 0.0,
      "end_time": 2.1
    }
  ]
}
```

### Species Information

#### Get Bird Species Details

**GET** `/species/{species_id}`

Retrieves detailed information about a specific bird species.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `species_id` | String | Yes | Unique species identifier or scientific name |

**Response:**
```json
{
  "success": true,
  "species": {
    "id": "turdus_migratorius",
    "common_name": "American Robin",
    "scientific_name": "Turdus migratorius",
    "family": "Turdidae",
    "order": "Passeriformes",
    "description": "A migratory songbird of the true thrush family.",
    "habitat": ["Woodlands", "Parks", "Gardens", "Lawns"],
    "geographic_range": "North America",
    "conservation_status": "Least Concern",
    "audio_characteristics": {
      "frequency_range": "1000-8000 Hz",
      "typical_call_duration": "2-4 seconds",
      "common_patterns": ["Cheerily cheer-up cheerio"]
    },
    "image_url": "https://api.kicaufinder.com/images/american_robin.jpg"
  }
}
```

#### Search Bird Species

**GET** `/species/search`

Search for bird species by name or characteristics.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | String | Yes | Search query (common name, scientific name, or family) |
| `limit` | Number | No | Maximum results to return (default: 20) |
| `region` | String | No | Geographic region filter |

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "turdus_migratorius",
      "common_name": "American Robin",
      "scientific_name": "Turdus migratorius",
      "family": "Turdidae",
      "match_score": 0.95
    }
  ],
  "total_results": 1,
  "query": "robin"
}
```

### User Management

#### Get Detection History

**GET** `/user/history`

Retrieves user's detection history.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | Number | No | Page number (default: 1) |
| `limit` | Number | No | Results per page (default: 20) |
| `start_date` | String | No | Start date filter (ISO 8601) |
| `end_date` | String | No | End date filter (ISO 8601) |
| `species` | String | No | Filter by species name |

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "det_12345",
      "filename": "morning_birds.wav",
      "upload_date": "2024-05-22T08:15:00Z",
      "processing_time": 3.2,
      "detections_count": 2,
      "top_species": "American Robin",
      "confidence": 0.92
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### Get Detection Details

**GET** `/user/history/{detection_id}`

Retrieves detailed results for a specific detection.

**Response:**
```json
{
  "success": true,
  "detection": {
    "id": "det_12345",
    "filename": "morning_birds.wav",
    "upload_date": "2024-05-22T08:15:00Z",
    "file_info": {
      "duration": 30.5,
      "sample_rate": 44100,
      "format": "wav",
      "size": 2650000
    },
    "detections": [
      {
        "species": "American Robin",
        "confidence": 0.92,
        "timestamps": [{"start": 2.3, "end": 4.7}]
      }
    ],
    "audio_url": "https://api.kicaufinder.com/audio/det_12345.wav"
  }
}
```

### Model Information

#### Get Model Status

**GET** `/model/status`

Returns current model information and system status.

**Response:**
```json
{
  "success": true,
  "model": {
    "version": "v2.1.0",
    "last_updated": "2024-04-15T12:00:00Z",
    "supported_species": 850,
    "accuracy": 0.94,
    "languages": ["en", "es", "fr"],
    "status": "active"
  },
  "system": {
    "uptime": "99.9%",
    "avg_processing_time": 2.1,
    "requests_today": 15420,
    "status": "operational"
  }
}
```

#### Get Supported Species List

**GET** `/model/species`

Returns list of all species supported by the current model.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region` | String | No | Filter by geographic region |
| `family` | String | No | Filter by bird family |
| `format` | String | No | Response format: 'json' or 'csv' (default: 'json') |

**Response:**
```json
{
  "success": true,
  "species": [
    {
      "id": "turdus_migratorius",
      "common_name": "American Robin",
      "scientific_name": "Turdus migratorius",
      "family": "Turdidae",
      "region": "North America"
    }
  ],
  "total_species": 850,
  "model_version": "v2.1.0"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_AUDIO_FORMAT",
    "message": "Audio format not supported. Please use WAV, MP3, FLAC, or OGG.",
    "details": {
      "received_format": "mp4",
      "supported_formats": ["wav", "mp3", "flac", "ogg"]
    }
  },
  "request_id": "req_12345"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | Invalid or missing API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_AUDIO_FORMAT` | 400 | Unsupported audio format |
| `FILE_TOO_LARGE` | 413 | Audio file exceeds size limit |
| `PROCESSING_ERROR` | 500 | Error during audio processing |
| `SPECIES_NOT_FOUND` | 404 | Requested species not found |
| `INVALID_PARAMETERS` | 400 | Invalid request parameters |

## Rate Limits

- **Free Tier:** 100 requests per hour
- **Pro Tier:** 1,000 requests per hour
- **Enterprise:** Custom limits

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1621234567
```

## SDKs and Examples

### JavaScript/Node.js Example

```javascript
const BirdVoiceAPI = require('kicaufinder-api');

const client = new BirdVoiceAPI('YOUR_API_KEY');

// Detect birds in audio file
const result = await client.detect({
  audio: './bird_recording.wav',
  confidence_threshold: 0.8
});

console.log(result.detections);
```

### cURL Example

```bash
curl -X POST \
  https://api.kicaufinder.com/v1/detect \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -F 'audio=@bird_recording.wav' \
  -F 'confidence_threshold=0.8'
```


---

