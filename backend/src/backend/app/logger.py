import logging
import sys
import traceback
from pathlib import Path

# Create logs directory if it doesn't exist
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# Configure logging
logger = logging.getLogger("healthcare_ai")
logger.setLevel(logging.INFO)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_format)
logger.addHandler(console_handler)

# File handler
file_handler = logging.FileHandler(logs_dir / "app.log")
file_handler.setLevel(logging.INFO)
file_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_format)
logger.addHandler(file_handler)

def log_traceback(e: Exception, context: str = "") -> None:
    """
    Log an exception's full traceback with context information
    
    Args:
        e: The exception to log
        context: Additional context about where/why the error occurred
    """
    # Get the full traceback
    tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
    
    # Format the error message
    error_msg = f"Exception occurred"
    if context:
        error_msg += f" in {context}"
    error_msg += f": {str(e)}"
    
    # Log the initial error message
    logger.error(error_msg)
    
    # Log the full traceback
    logger.error("Full traceback:")
    for line in tb_lines:
        # Remove newlines and log each line separately for better formatting
        for tb_line in line.rstrip().split('\n'):
            if tb_line:
                logger.error(tb_line)
