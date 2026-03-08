import logging
import json
import sys
import os
import uuid
from contextvars import ContextVar

correlation_id: ContextVar[str] = ContextVar('correlation_id', default=None)

def get_correlation_id():
    return correlation_id.get()

def set_correlation_id(correlation_id_value: str = None):
    if correlation_id_value is None:
        correlation_id_value = str(uuid.uuid4())
    correlation_id.set(correlation_id_value)
    return correlation_id_value

class JsonFormatter(logging.Formatter):
    """Simple JSON Formatter using standard libraries only."""
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "name": record.name,
            "level": record.levelname,
            "correlation_id": get_correlation_id(),
            "message": record.getMessage()
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

def setup_logger(name):
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
        
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler(sys.stdout)
    formatter = JsonFormatter(datefmt="%Y-%m-%d %H:%M:%S")
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    return logger

# Default app logger
logger = setup_logger("SchemeSense")
