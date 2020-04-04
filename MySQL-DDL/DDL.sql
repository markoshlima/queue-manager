CREATE TABLE queue (
  id_queue varchar(40) CHARACTER SET utf8 NOT NULL,
  name varchar(120) CHARACTER SET utf16 NOT NULL,
  text_queue text CHARACTER SET utf8,
  end_queue text,
  logo varchar(50) DEFAULT NULL,
  date_register datetime DEFAULT NULL,
  id_user varchar(40) DEFAULT NULL,
  PRIMARY KEY (id_queue)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE queue_client (
  id_queue_client varchar(40) CHARACTER SET utf8 NOT NULL,
  name varchar(120) CHARACTER SET utf16 NOT NULL,
  email varchar(120) DEFAULT NULL,
  telephone varchar(50) DEFAULT NULL,
  date_in datetime NOT NULL,
  date_out datetime DEFAULT NULL,
  removed tinyint(1) DEFAULT NULL,
  id_queue varchar(40) DEFAULT NULL,
  PRIMARY KEY (id_queue_client)
) ENGINE=InnoDB DEFAULT CHARSET=latin1