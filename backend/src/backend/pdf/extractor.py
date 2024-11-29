import os
from typing import Optional
import pdfplumber
from src.backend.app.logger import logger, log_traceback


def extract_text_from_pdf(pdf_path: str) -> Optional[str]:
    """
    Extract text from a PDF file using pdfplumber.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Extracted text as string, or None if extraction fails
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        Exception: For other PDF processing errors
    """
    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
        with pdfplumber.open(pdf_path) as pdf:
            text = ''.join([
                page.extract_text() 
                for page in pdf.pages 
                if page.extract_text() is not None
            ])
            
            if not text.strip():
                logger.warning(f"No text extracted from PDF: {pdf_path}")
                return None
                
            return text
            
    except FileNotFoundError:
        raise
    except Exception as e:
        log_traceback(e, f"PDF text extraction failed for {pdf_path}")
        raise


def get_pdf_metadata(pdf_path: str) -> Optional[dict]:
    """
    Get metadata from a PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary containing PDF metadata, or None if extraction fails
        
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
