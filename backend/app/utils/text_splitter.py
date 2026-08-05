from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List

def split_text(text: str) -> List[str]: #Type hint

    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 100,
    )
    return splitter.split_text(text)