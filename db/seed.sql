-- Cameras
INSERT INTO Camera (name, location) VALUES ('Shop Floor A', 'Ground Floor');
INSERT INTO Camera (name, location) VALUES ('Vault', 'Basement');
INSERT INTO Camera (name, location) VALUES ('Entrance', 'Main Door');

-- Incidents
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (1, 'Unauthorised Access', '2024-06-10T08:00:00', '2024-06-10T08:05:00', '/thumbnails/incident1.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (1, 'Gun Threat', '2024-06-10T09:00:00', '2024-06-10T09:02:00', '/thumbnails/incident2.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (1, 'Face Recognised', '2024-06-10T10:00:00', '2024-06-10T10:01:00', '/thumbnails/incident3.jpg', 1);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (1, 'Unauthorised Access', '2024-06-10T11:00:00', '2024-06-10T11:03:00', '/thumbnails/incident4.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (2, 'Gun Threat', '2024-06-10T12:00:00', '2024-06-10T12:04:00', '/thumbnails/incident5.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (2, 'Face Recognised', '2024-06-10T13:00:00', '2024-06-10T13:01:00', '/thumbnails/incident6.jpg', 1);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (2, 'Unauthorised Access', '2024-06-10T14:00:00', '2024-06-10T14:05:00', '/thumbnails/incident7.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (2, 'Gun Threat', '2024-06-10T15:00:00', '2024-06-10T15:02:00', '/thumbnails/incident8.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (3, 'Face Recognised', '2024-06-10T16:00:00', '2024-06-10T16:01:00', '/thumbnails/incident9.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (3, 'Unauthorised Access', '2024-06-10T17:00:00', '2024-06-10T17:03:00', '/thumbnails/incident10.jpg', 0);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (3, 'Gun Threat', '2024-06-10T18:00:00', '2024-06-10T18:02:00', '/thumbnails/incident11.jpg', 1);
INSERT INTO Incident (cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved) VALUES (3, 'Face Recognised', '2024-06-10T19:00:00', '2024-06-10T19:01:00', '/thumbnails/incident12.jpg', 0); 