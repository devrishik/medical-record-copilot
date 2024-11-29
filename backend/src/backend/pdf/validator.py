import os
from typing import Tuple, Optional
import pdfplumber
from src.backend.app.logger import logger, log_traceback


def validate_pdf(pdf_path: str) -> Tuple[bool, Optional[str]]:
    """
    Validate a PDF file by checking if it exists and can be opened.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Tuple of (is_valid: bool, error_message: Optional[str])
        If PDF is valid, returns (True, None)
        If PDF is invalid, returns (False, error_message)
    """
    try:
        if not os.path.exists(pdf_path):
            return False, f"PDF file not found: {pdf_path}"
            
        if not os.path.isfile(pdf_path):
            return False, f"Path is not a file: {pdf_path}"
            
        # Check if file is empty
        if os.path.getsize(pdf_path) == 0:
            return False, f"PDF file is empty: {pdf_path}"
            
        # Try to open and read the PDF
        with pdfplumber.open(pdf_path) as pdf:
            # Check if PDF has any pages
            if len(pdf.pages) == 0:
                return False, f"PDF has no pages: {pdf_path}"
                
            # Try to access first page to verify PDF is readable
            pdf.pages[0]
            
        return True, None
            
    except Exception as e:
        error_msg = f"Invalid PDF file: {str(e)}"
        log_traceback(e, f"PDF validation failed for {pdf_path}")
        return False, error_msg
