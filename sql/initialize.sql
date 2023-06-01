Use passit;

/* 
 * This is all the initialization sql to create tables, procs and indexes.
 */
 
DROP TABLE Transit_PIT;

CREATE TABLE Transit_PIT (
	Id Integer PRIMARY KEY AUTO_INCREMENT,
	StudentId Integer,
	IsOpen Boolean,
    CreateDate DateTime,
	ModifyDate DateTime
);


DROP PROCEDURE IF EXISTS CreateTransit;

DELIMITER //
CREATE PROCEDURE CreateTransit ( IN inStudentId Integer, inIsOpen Boolean, OUT LID Integer)
BEGIN
	INSERT INTO Transit_PIT
		( StudentId, IsOpen, CreateDate, ModifyDate)
	VALUES
		 ( inStudentId, inIsOpen,Now(),Now());
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
CREATE PROCEDURE UpdateTransit (IN inTransitId Integer, inStudentId Integer, inIsOpen Boolean)
BEGIN
	UPDATE 
		Transit_PIT
	SET
	    StudentId = inStudentId,
		IsOpen = inIsOpen,
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
	Location Integer,
	ByUser Integer,
	TheEvent varchar(255),
    CreateDate DateTime,
	ModifyDate DateTime
);

DROP PROCEDURE IF EXISTS CreateTransitLeg;

DELIMITER //
CREATE PROCEDURE CreateTransitLeg ( IN inTransitId Integer, inLocation Integer, inByUser Integer, inTheEvent varchar(255), OUT LID Integer)
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
CREATE PROCEDURE UpdateTransitLeg (IN inTransitLegId Integer, inTransitId Integer, inLocation Integer, inByUser Integer, inTheEvent varchar(255))
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



