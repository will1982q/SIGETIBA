-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema DBstore
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema DBstore
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `DBstore` DEFAULT CHARACTER SET utf8 ;
USE `DBstore` ;

-- -----------------------------------------------------
-- Table `DBstore`.`supplier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`supplier` (
  `id_supplier` INT NOT NULL AUTO_INCREMENT,
  `nit_s` VARCHAR(11) NULL,
  `name_s` VARCHAR(45) NOT NULL,
  `phone_s` VARCHAR(10) NULL,
  `email_s` VARCHAR(45) NULL,
  PRIMARY KEY (`id_supplier`),
  UNIQUE INDEX `nit_s_UNIQUE` (`nit_s` ASC) VISIBLE,
  UNIQUE INDEX `name_s_UNIQUE` (`name_s` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`purchase_invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`purchase_invoice` (
  `id_purchase_invoice` INT NOT NULL AUTO_INCREMENT,
  `number_pi` VARCHAR(15) NOT NULL,
  `datetime_pi` VARCHAR(19) NOT NULL,
  `id_supplier_pi` INT NOT NULL,
  PRIMARY KEY (`id_purchase_invoice`),
  INDEX `fk_buying_invoice_suplier_idx` (`id_supplier_pi` ASC) VISIBLE,
  CONSTRAINT `fk_purchase_invoice_supplier`
    FOREIGN KEY (`id_supplier_pi`)
    REFERENCES `DBstore`.`supplier` (`id_supplier`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`product` (
  `id_product` INT NOT NULL AUTO_INCREMENT,
  `name_p` VARCHAR(45) NOT NULL,
  `ean_p` VARCHAR(13) NULL,
  `purchase_price_p` FLOAT NOT NULL DEFAULT 0,
  `sale_price_p` FLOAT NOT NULL DEFAULT 0,
  `id_supplier_p` INT NOT NULL,
  PRIMARY KEY (`id_product`),
  UNIQUE INDEX `name_p_UNIQUE` (`name_p` ASC) VISIBLE,
  UNIQUE INDEX `ean_p_UNIQUE` (`ean_p` ASC) VISIBLE,
  INDEX `fk_product_supplier1_idx` (`id_supplier_p` ASC) VISIBLE,
  CONSTRAINT `fk_product_supplier1`
    FOREIGN KEY (`id_supplier_p`)
    REFERENCES `DBstore`.`supplier` (`id_supplier`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`purchase_invoice_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`purchase_invoice_detail` (
  `id_purchase_invoice_detail` INT NOT NULL AUTO_INCREMENT,
  `quantity_pid` SMALLINT NOT NULL,
  `id_purchase_invoice_pid` INT NOT NULL,
  `id_product_pid` INT NOT NULL,
  PRIMARY KEY (`id_purchase_invoice_detail`),
  INDEX `fk_buying_invoice_detail_buying_invoice1_idx` (`id_purchase_invoice_pid` ASC) VISIBLE,
  INDEX `fk_buying_invoice_detail_product1_idx` (`id_product_pid` ASC) VISIBLE,
  CONSTRAINT `fk_purchase_invoice_detail_purchase_invoice1`
    FOREIGN KEY (`id_purchase_invoice_pid`)
    REFERENCES `DBstore`.`purchase_invoice` (`id_purchase_invoice`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_buying_invoice_detail_product1`
    FOREIGN KEY (`id_product_pid`)
    REFERENCES `DBstore`.`product` (`id_product`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`stock` (
  `id_stock` INT NOT NULL AUTO_INCREMENT,
  `quantity_s` INT NOT NULL DEFAULT 0,
  `id_product_s` INT NOT NULL,
  PRIMARY KEY (`id_stock`),
  INDEX `fk_stock_product1_idx` (`id_product_s` ASC) VISIBLE,
  CONSTRAINT `fk_stock_product1`
    FOREIGN KEY (`id_product_s`)
    REFERENCES `DBstore`.`product` (`id_product`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`sale_invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`sale_invoice` (
  `id_sale_invoice` INT NOT NULL AUTO_INCREMENT,
  `datetime_si` VARCHAR(19) NOT NULL,
  PRIMARY KEY (`id_sale_invoice`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`sale_invoice_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`sale_invoice_detail` (
  `id_sale_invoice_detail` INT NOT NULL AUTO_INCREMENT,
  `quantity_sid` SMALLINT NOT NULL,
  `id_product_sid` INT NOT NULL,
  `id_sale_invoice_sid` INT NOT NULL,
  PRIMARY KEY (`id_sale_invoice_detail`),
  INDEX `fk_sale_invoice_detail_product1_idx` (`id_product_sid` ASC) VISIBLE,
  INDEX `fk_sale_invoice_detail_sale_invoice1_idx` (`id_sale_invoice_sid` ASC) VISIBLE,
  CONSTRAINT `fk_sale_invoice_detail_product1`
    FOREIGN KEY (`id_product_sid`)
    REFERENCES `DBstore`.`product` (`id_product`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sale_invoice_detail_sale_invoice1`
    FOREIGN KEY (`id_sale_invoice_sid`)
    REFERENCES `DBstore`.`sale_invoice` (`id_sale_invoice`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`cash`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`cash` (
  `id_cash` INT NOT NULL AUTO_INCREMENT,
  `open_datetime_c` VARCHAR(19) NOT NULL,
  `open_value_c` FLOAT NOT NULL DEFAULT 0,
  `close_datetime_c` VARCHAR(19) NOT NULL,
  `close_value_c` FLOAT NOT NULL,
  `state_c` VARCHAR(7) NULL,
  PRIMARY KEY (`id_cash`),
  UNIQUE INDEX `close_datetime_ds_UNIQUE` (`close_datetime_c` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBstore`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DBstore`.`employee` (
  `id_employee` INT NOT NULL AUTO_INCREMENT,
  `first_name_e` VARCHAR(45) NOT NULL,
  `last_name_e` VARCHAR(45) NOT NULL,
  `identification_card_e` VARCHAR(10) NOT NULL,
  `username_e` VARCHAR(16) NOT NULL,
  `password_e` VARCHAR(32) NOT NULL,
  `type_e` VARCHAR(13) NOT NULL DEFAULT 'VENDEDOR',
  `email_e` VARCHAR(255) NULL,
  `phone_e` VARCHAR(10) NULL,
  `is_active_e` TINYINT NOT NULL DEFAULT 1,
  UNIQUE INDEX `username_UNIQUE` (`username_e` ASC) VISIBLE,
  PRIMARY KEY (`id_employee`),
  UNIQUE INDEX `identification_card_p_UNIQUE` (`identification_card_e` ASC) VISIBLE);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
