# SimpleFileTransfer
## Wie ein Client auf die Seite kommt:
1. Er geht auf die Seite sft.mycoding.systems und bekommt ein 2 Fenster mit den Auswahlmöglichkeiten:
```
1. Daten empfangen
2. Daten senden
```

## Wenn ein Client auf `Daten empfangen` klickt
1. Er wird auf eine Seite mit QR-Code weitergeleitet. Unter dem QR-Code steht noch ein Code, falls ein scannen des QR-Codes nicht möglich ist. 
2. Es befindet sich nun eine leere Tabelle auf der Seite, die gefüllt wird, wenn er daten bekommt

## Wenn der Client auf `Daten senden` klickt
1. Es öffnet sich ein weiteres Fenster, bei dem man sich zwischen `QR-Code scannen` und `Code eingeben` entscheiden muss
### `QR-Code scannen`
Es öffnet sich jetzt ein Fenster, um einen QR-Code zu scannen

### `Code eingeben`
Es öffnet sich ein Eingabefeld mit einer 10-Stelligen Pin-Eingabe und einem Senden-Button

## Nachdem der Code nun eingegeben ist
Es öffnet sich nun ein weiters Fenster, bei dem man sich zwischen `Datei senden` und `Text senden` entscheiden muss

### `Datei senden`
Man sieht nun eine Form, wo man eine / mehrere Dateien auswählen und hochladen kann. Es werden dann die Dateien dann an die route `POST /api/code/{codeID}/files` gesendet
### `Text senden`
Man sieht eine Text-Form, wo man einen Text eingeben kann. Der Text wird dann an die route `POST /api/code/{codeID}/text` gesendet.

# Rest-Api-Aufbau
Route                    | Method   | Beschreibung       | Beispiel-Body                                       |
-------------------------|----------| ------------------ | ----------------------------------------------------| 
/api/code/{codeID}/files | POST     | Dateien senden     | ```{ "files": [] } ```                              |
/api/code/{codeID}/text  | POST     | Text senden        | ```{"text": "This is a example text to send :)"} ```|

# Websocket-Api-Aufbau
Event             | Method  | Beschreibung                                  | Beispiel-Body |
------------------|---------|---------------------------------------------- | --------------| 
code/generate     | SEND    |Event zum Anfragen eines Send-Codes            | empty body    |
code/generate     | RECEIVE |Event um den Angefragten Code zu empfangen     | ``` {"code":"1234567890", "jwt":"thisIsAValidJWT"} ```    |
code/login        | SEND    | Event um sich anzumelden, wenn ein jwt existiert   | ``` {"jwt":"thisIsAValidJWT"} ```    |
code/login        | RECEIVE |Event den Status des logins zu bekommen    |``` {"success":false} ```    |
code/check        | SEND    |Event um zu überprüfen, ob der eingegebene Code online ist      | ``` {"code": "1234567890"} ```   |
code/check        | RECEIVE    |Event um die Validierungs Info des angefragten codes zu halten     | ``` {"code": "1234567890", "valid": "true/false"} ```   |
code/files        | RECEIVE |Event um die Info über eine erhaltende Datei   | ``` {"files": [{"fileID": "uuid", "storageType": "s3 / local", "domain": "s3.mycoding.systems-sdf.mycoding.systems", "fileUrl": "/sdf/public/{uuid} - /upload/{fileID}"}]} ```|
code/text         | RECEIVE |Event um gesendeten Text zu erhalten           | ```{"text": "This is a example text to send :)"} ``` | 
