export interface InputProps {
    type: string;
    placeholder?: string;
    className?: string;
    name?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  }
  