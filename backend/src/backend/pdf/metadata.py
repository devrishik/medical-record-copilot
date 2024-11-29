import os
from typing import Optional, Dict, Any
import pdfplumber
from src.backend.app.logger import logger, log_traceback


def get_pdf_metadata(pdf_path: str) -> Optional[Dict[str, Any]]:
    """
    Get metadata from a PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary containing PDF metadata, or None if extraction fails
        Keys:
            - pages: Number of pages in the PDF
            - metadata: PDF document metadata (title, author, etc.)
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        Exception: For other PDF processing errors
    """
    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
        with pdfplumber.open(pdf_path) as pdf:
            return {
                'pages': len(pdf.pages),
                'metadata': pdf.metadata
            }
            
    except FileNotFoundError:
        raise
    except Exception as e:
        log_traceback(e, f"PDF metadata extraction failed for {pdf_path}")
        raise
