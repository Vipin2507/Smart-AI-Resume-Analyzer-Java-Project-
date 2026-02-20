package com.resumeanalyzer.exception;

/**
 * Thrown when uploaded file is invalid (wrong type, empty, etc.).
 */
public class InvalidFileException extends RuntimeException {

    public InvalidFileException(String message) {
        super(message);
    }
}
