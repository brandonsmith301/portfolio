import React from 'react';
import { Tooltip } from './Tooltip';

interface CitationTooltipProps {
  citationNumber: number;
  authors: string | string[];
  title: string;
  journal: string;
  volume?: string | number;
  issue?: string | number;
  year: string | number;
  pages?: string;
  issn?: string;
  doi?: string;
  url?: string; 
}

export const CitationTooltip: React.FC<CitationTooltipProps> = ({
  citationNumber,
  authors,
  title,
  journal,
  volume,
  issue,
  year,
  pages,
  issn,
  doi,
  url,
}) => {
  const authorString = Array.isArray(authors) ? authors.join(', ') : authors;

  const referenceContent = (
    <div className="text-left block px-1.5 pt-0.5 pb-1.5 max-w-md" style={{ textAlign: 'left' }}>
      <p className="font-bold text-sm text-left" style={{ textAlign: 'left' }}>{title}</p>
      <p className="text-sm text-left" style={{ textAlign: 'left' }}>{authorString}</p>
      <p className="text-sm italic text-left" style={{ textAlign: 'left' }}>
        {journal}
        {volume && `, Vol. ${volume}`}
        {issue && `, No. ${issue}`}
        {pages && `, pp. ${pages}`}
        , {year}
      </p>
      {issn && <p className="text-xs text-left" style={{ textAlign: 'left' }}>ISSN: {issn}</p>}
      {doi && (
        <p className="text-xs text-left" style={{ textAlign: 'left' }}>
          DOI: <a href={doi.startsWith('http') ? doi : `https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            {doi}
          </a>
        </p>
      )}
      {!doi && url && (
        <p className="text-xs text-left" style={{ textAlign: 'left' }}>
          Available at: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            {url}
          </a>
        </p>
      )}
    </div>
  );

  return (
    <Tooltip content={referenceContent} isCitation={true}>
      [{citationNumber}]
    </Tooltip>
  );
}; 