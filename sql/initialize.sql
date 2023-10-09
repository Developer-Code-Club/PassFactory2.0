Use passit;

/* 
 * This is all the initialization sql to create tables, procs and indexes.
 */
 
DROP TABLE Transit_PIT;

CREATE TABLE Transit_PIT (
	Id Integer PRIMARY KEY AUTO_INCREMENT,
	StudentId Integer,
	IsOpen Boolean,
	Note Text,
    CreateDate DateTime,
	ModifyDate DateTime
);


DROP PROCEDURE IF EXISTS CreateTransit;

DELIMITER //
CREATE PROCEDURE CreateTransit ( IN inStudentId Integer, inIsOpen Boolean, inNote Text, OUT LID Integer)
BEGIN
	INSERT INTO Transit_PIT
		( StudentId, IsOpen, Note, CreateDate, ModifyDate)
	VALUES
		 ( inStudentId, inIsOpen,inNote, Now(),Now());
	SELECT LAST_INSERT_ID() INTO LID;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetTransits;

DELIMITER //
CREATE PROCEDURE GetTransits ()
BEGIN
	SELECT * FROM Transit_PIT;
END
//
DELIMITER ;


DROP PROCEDURE IF EXISTS GetTransitsByDate;

DELIMITER //
CREATE PROCEDURE GetTransitsByDate (dt Date)
BEGIN

SELECT 
		t.Id AS Id,
		l.Id AS LegId,
		t.isOpen AS IsOpen,
		t.Note AS Note,
		t.StudentId AS StudentId,
		l.CreateDate AS CreateDate,
		l.ModifyDate AS ModifyDate,
		l.ByUser AS ByUser,
		l.Location AS Location,
		l.TheEvent AS TheEvent
	FROM 
		Transit_Leg_PIT AS l, 
		Transit_PIT AS t 
	WHERE  
		l.TransitId = t.Id
	AND
		t.CreateDate >= dt ;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteTransit;

DELIMITER //
CREATE PROCEDURE DeleteTransit (IN inTransitId Integer)
BEGIN
	DELETE FROM Transit_PIT WHERE Transit_PIT.Id = inTransitId;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateTransit;

DELIMITER //
CREATE PROCEDURE UpdateTransit (IN inTransitId Integer, inStudentId Integer, inIsOpen Boolean, inNote Text)
BEGIN
	UPDATE 
		Transit_PIT
	SET
	    StudentId = inStudentId,
		IsOpen = inIsOpen,
		Note = inNote,
		ModifyDate = Now()
		WHERE 
			Transit_PIT.Id = inTransitId;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS CloseTransit;

DELIMITER //
CREATE PROCEDURE CloseTransit (IN inTransitId Integer)
BEGIN
	UPDATE 
		Transit_PIT
	SET
		IsOpen = False,
		ModifyDate = Now()
		WHERE 
			Transit_PIT.Id = inTransitId;
END
//
DELIMITER ;

DROP TABLE Transit_Leg_PIT;

CREATE TABLE Transit_Leg_PIT (
	Id Integer PRIMARY KEY AUTO_INCREMENT,
	TransitId Integer,
	Location varchar(255),
	ByUser Integer,
	TheEvent varchar(255),
    CreateDate DateTime,
	ModifyDate DateTime
);

DROP PROCEDURE IF EXISTS CreateTransitLeg;

DELIMITER //
CREATE PROCEDURE CreateTransitLeg ( IN inTransitId Integer, inLocation varchar(255), inByUser Integer, inTheEvent varchar(255), OUT LID Integer)
BEGIN
	INSERT INTO Transit_Leg_PIT
		( TransitId, Location, ByUser,TheEvent, CreateDate, ModifyDate )
	VALUES
		 ( inTransitId, inLocation,inByUser, inTheEvent, Now(),Now());
	SELECT LAST_INSERT_ID() INTO LID;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetTransitLegs;

DELIMITER //
CREATE PROCEDURE GetTransitLegs ()
BEGIN
	SELECT * FROM Transit_Leg_PIT;
END
//
DELIMITER ;


DROP PROCEDURE IF EXISTS DeleteTransitLeg;

DELIMITER //
CREATE PROCEDURE DeleteTransitLeg (IN inTransitLegId Integer)
BEGIN
	DELETE FROM Transit_Leg_PIT WHERE Transit_Leg_PIT.Id = inTransitLegId;
END
//
DELIMITER ;
DROP PROCEDURE IF EXISTS UpdateTransitLeg;

DELIMITER //
CREATE PROCEDURE UpdateTransitLeg (IN inTransitLegId Integer, inTransitId Integer, inLocation varchar(255), inByUser Integer, inTheEvent varchar(255))
BEGIN
	UPDATE 
		Transit_Leg_PIT
	SET
	    TransitId = inTransitId,
		Location = inLocation,
		ByUser = inByUser,
		TheEvent = inTheEvent,
		ModifyDate = Now()
		WHERE 
			Transit_Leg_PIT.Id = inTransitLegId;
END
//
DELIMITER ;
DROP PROCEDURE IF EXISTS FlipRoomTransitLegs;

DELIMITER //
CREATE PROCEDURE FlipRoomTransitLegs (IN inTransitId Integer, inLocation varchar(255), inByUser Integer)
BEGIN
	UPDATE 
		Transit_Leg_PIT
	SET
		Location = inLocation,
		ByUser = inByUser,
		ModifyDate = Now()
		WHERE 
			Transit_Leg_PIT.TransitId = inTransitId;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetTransitsReport;

DELIMITER //
CREATE PROCEDURE GetTransitsReport (dt1 Date,loc varchar(255))
BEGIN
	SELECT 
		t.Id AS Id,
		t.StudentId AS StudentId,
		l.CreateDate AS CreateDate,
		l.ModifyDate AS ModifyDate,
		l.ByUser AS ByUser,
		l.Location AS Location,
		l.TheEvent AS TheEvent,
		t.Note AS Note
	FROM 
		Transit_Leg_PIT AS l, 
		Transit_PIT AS t 
	WHERE  
		l.TransitId = t.Id 
	AND 
		l.Location = loc
	AND 
		l.CreateDate >= dt1 
	AND 
		l.CreateDate < DATE_ADD(dt1,INTERVAL 1 DAY);
END//
DELIMITER ;	


DROP TABLE Temp_User_PIT;

CREATE TABLE Temp_User_PIT (
	Id Integer PRIMARY KEY AUTO_INCREMENT,
	Name varchar(255),
    CreateDate DateTime,
	ModifyDate DateTime
);

DROP PROCEDURE IF EXISTS CreateTempUser;

DELIMITER //
CREATE PROCEDURE CreateTempUser ( IN inName varchar(255),  OUT LID Integer)
BEGIN
	INSERT INTO Temp_User_PIT
		( Name, CreateDate, ModifyDate )
	VALUES
		 ( inName, Now(),Now());
	SELECT LAST_INSERT_ID() INTO LID;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetTempUsers;

DELIMITER //
CREATE PROCEDURE GetTempUsers ()
BEGIN
	SELECT * FROM Temp_User_PIT;
END
//
DELIMITER ;


DROP PROCEDURE IF EXISTS DeleteTempUser;

DELIMITER //
CREATE PROCEDURE DeleteTempUser (IN inId Integer)
BEGIN
	DELETE FROM Temp_User_PIT WHERE Temp_User_PIT.Id = inId;
END
//
DELIMITER ;
DROP PROCEDURE IF EXISTS UpdateTempUser;

DELIMITER //
CREATE PROCEDURE UpdateTempUser (IN inId Integer, inName varchar(255))
BEGIN
	UPDATE 
		Temp_User_PIT
	SET
	    Name = inName,
		ModifyDate = Now()
		WHERE 
			Temp_User_PIT.Id = inId;
END
//
DELIMITER ;



DROP TABLE Room_Info_PIT;

CREATE TABLE Room_Info_PIT (
	Id varchar(255),
	RoomType varchar(255),
	Capacity Integer,
	MaleCapacity Integer,
	FemaleCapacity Integer,
	DualRoom Boolean,
	DualRoomId varchar(255),
    CreateDate DateTime,
	ModifyDate DateTime
); 
DROP PROCEDURE IF EXISTS CreateRoomInfo

DELIMITER //
CREATE PROCEDURE CreateRoomInfo ( IN inId varchar(255), inRoomType varchar(255),inCapacity Integer, inMaleCapacity Integer, inFemaleCapacity Integer, inDualRoom Boolean, inDualRoomId varchar(255) )
BEGIN
	INSERT INTO Room_Info_PIT
		( Id,RoomType, Capacity, MaleCapacity, FemaleCapacity,DualRoom, DualRoomId, CreateDate, ModifyDate )
	VALUES
		 ( inId, inRoomType, inCapacity,inMaleCapacity,inFemaleCapacity,inDualRoom, inDualRoomId, Now(),Now());
END
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetRoomInfo ()
BEGIN
	SELECT * FROM Room_Info_PIT;
END
//
DELIMITER ;


DROP PROCEDURE IF EXISTS DeleteRoomInfo;

DELIMITER //
CREATE PROCEDURE DeleteRoomInfo (IN inId varchar(255))
BEGIN
	DELETE FROM Room_Info_PIT WHERE Room_Info_PIT.Id = inId;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateRoomInfo;

DELIMITER //
CREATE PROCEDURE UpdateRoomInfo  ( IN inId varchar(255), inRoomType varchar(255),inCapacity Integer, inMaleCapacity Integer, inFemaleCapacity Integer, inDualRoom Boolean, inDualRoomId varchar(255) )
BEGIN
	UPDATE 
		Room_Info_PIT
	SET
	    RoomType = inRoomType,
		Capacity = inCapacity,
		MaleCapacity = inMaleCapacity,
		FemaleCapacity = inFemaleCapacity,
		DualRoom = inDualRoom,
		DualRoomId = inDualRoomId,
		ModifyDate = Now()
		WHERE 
			Room_Info_PIT.Id = inId;
END
//
DELIMITER ;


/*
 * Create USER
 */
CREATE USER 'passit'@'localhost' IDENTIFIED BY 'passit';
FLUSH PRIVILEGES;
GRANT INSERT, UPDATE, DELETE, SELECT, EXECUTE on *.* TO 'passit'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;