import logging
import json
import sys
import os
import uuid
from contextvars import ContextVar
from pythonjsonlogger import jsonlogger
from config import CLOUDWATCH_LOG_GROUP

correlation_id: ContextVar[str] = ContextVar('correlation_id', default=None)

def get_correlation_id():
    return correlation_id.get()

def set_correlation_id(correlation_id_value: str = None):
    if correlation_id_value is None:
        correlation_id_value = str(uuid.uuid4())
    correlation_id.set(correlation_id_value)
    return correlation_id_value

class CorrelationIdFilter(logging.Filter):
    def filter(self, record):
        record.correlation_id = get_correlation_id()
        return True

def setup_logger(name):
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
        
    logger.setLevel(logging.INFO)
    
    # Add correlation ID filter
    logger.addFilter(CorrelationIdFilter())
    
    handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(name)s %(levelname)s %(correlation_id)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    return logger

# Default app logger
logger = setup_logger("SchemeSense")
