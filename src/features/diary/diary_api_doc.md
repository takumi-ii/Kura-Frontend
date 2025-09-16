**Base URL**

```
http://localhost:8000/api
```

---

## 1. Create Diary Entry

**Endpoint**

```
POST /diary/entry/
```

**Request (multipart/form-data)**

| Field          | Type      | Required | Description                                    |
| -------------- | --------- | :------: | ---------------------------------------------- |
| `title`        | string    |    yes   | Entry title                                    |
| `body`         | string    |    yes   | Entry body text                                |
| `book_id`      | UUID      |    yes   | Parent book’s UUID                             |
| `is_public`    | boolean   |    no    | Public visibility flag (default: `false`)      |
| `status`       | string    |    no    | `"draft"` or `"complete"` (default: `"draft"`) |
| `tags`         | string\[] |    no    | List of tag names                              |
| `shared_users` | UUID\[]   |    no    | List of user UUIDs to share with               |
| `images`       | file\[]   |    no    | One or more image files                        |

**Response**

* **Status:** `201 Created`
* **Body (application/json)**

  ```json
  {
    "entry_id": "3c462760-74ac-4baf-93d2-6acd54078470",
    "title":    "test1",
    "book_id":  "e3433ab4-e8f2-4850-8cdc-a08a73994a0f"
  }
  ```

---

## 2. List Entries by Period

**Endpoint**

```
GET /diary/entries/
```

**Query Parameters**

| Name         | Type   | Required | Description                                     |
| ------------ | ------ | :------: | ----------------------------------------------- |
| `start_date` | string |    yes   | ISO‑8601 datetime (e.g. `2025-07-01T00:00:00Z`) |
| `end_date`   | string |    yes   | ISO‑8601 datetime (e.g. `2025-07-20T23:59:59Z`) |

**Example Request**

```
GET /diary/entries/?start_date=2025-07-01T00:00:00Z&end_date=2025-07-20T23:59:59Z
```

**Response**

* **Status:** `200 OK`
* **Body (application/json)**

  ```json
  [
    {
      "id":         "3c462760-74ac-4baf-93d2-6acd54078470",
      "images": [
        {
          "id":              "accfdd4e-1157-486c-8d22-5f4eeaddc273",
          "immich_asset_id": "f1b678fb-9e42-4456-984d-01b95631077f"
        }
      ],
      "title":      "test1",
      "body":       "test body1",
      "created_at": "2025-07-20T20:00:59.146176+08:00",
      "updated_at": "2025-07-20T20:00:59.146231+08:00",
      "status":     "complete",
      "tags":       ["test"],
      "is_public":  true,
      "book":       "e3433ab4-e8f2-4850-8cdc-a08a73994a0f",
      "author":     "8d769bb2-5ce5-43d4-9843-65e9df7e8997",
      "shared_users": []
    }
  ]
  ```

---

## 3. Retrieve Single Entry

**Endpoint**

```
GET /diary/entry/{entry_id}/
```

**Path Parameters**

| Name       | Type | Required | Description             |
| ---------- | ---- | :------: | ----------------------- |
| `entry_id` | UUID |    yes   | UUID of the diary entry |

**Example Request**

```
GET /diary/entry/3c462760-74ac-4baf-93d2-6acd54078470/
```

**Response**

* **Status:** `200 OK`
* **Body (application/json)**

  ```json
  {
    "id":         "3c462760-74ac-4baf-93d2-6acd54078470",
    "images": [
      {
        "id":              "accfdd4e-1157-486c-8d22-5f4eeaddc273",
        "immich_asset_id": "f1b678fb-9e42-4456-984d-01b95631077f"
      },
      {
        "id":              "523ffe68-0d37-454b-9ba5-b9606905ea89",
        "immich_asset_id": "105f1ebc-6096-445a-addc-3923ac204366"
      }
    ],
    "title":      "test1",
    "body":       "test body1",
    "created_at": "2025-07-20T20:00:59.146176+08:00",
    "updated_at": "2025-07-20T20:02:02.836368+08:00",
    "status":     "complete",
    "tags":       ["test"],
    "is_public":  true,
    "book":       "e3433ab4-e8f2-4850-8cdc-a08a73994a0f",
    "author":     "8d769bb2-5ce5-43d4-9843-65e9df7e8997",
    "shared_users": []
  }
  ```

---

## 4. Update Diary Entry

**Endpoint**

```
PATCH /diary/entry/{entry_id}/
```

**Path Parameters**

| Name       | Type | Required | Description             |
| ---------- | ---- | :------: | ----------------------- |
| `entry_id` | UUID |    yes   | UUID of the diary entry |

**Request (multipart/form-data or JSON)**
Include only the fields you wish to change. Common fields:

* `title` (string)
* `body` (string)
* `status` (`"draft"` | `"complete"`)
* `tags` (string\[])
* `is_public` (boolean)
* `shared_users` (UUID\[])
* `images` (file\[])

**Example Response**

* **Status:** `200 OK`
* **Body (application/json)**

  ```json
  {
    "entry_id": "3c462760-74ac-4baf-93d2-6acd54078470",
    "title":    "test1",
    "updated":  true
  }
  ```

---

## 5. Delete Diary Entry

**Endpoint**

```
DELETE /diary/entry/{entry_id}/
```

**Path Parameters**

| Name       | Type | Required | Description             |
| ---------- | ---- | :------: | ----------------------- |
| `entry_id` | UUID |    yes   | UUID of the diary entry |

**Query Parameters**

| Name            | Type    | Required | Description                                               |
| --------------- | ------- | :------: | --------------------------------------------------------- |
| `delete_images` | boolean |    no    | If `true`, also delete all associated images from storage |

**Example Request**

```
DELETE /diary/entry/3c462760-74ac-4baf-93d2-6acd54078470/?delete_images=true
```

**Response**

* **Status:** `204 No Content`
* **Body (application/json)**

  ```json
  {
    "message": "エントリーを削除しました。"
  }
  ```

