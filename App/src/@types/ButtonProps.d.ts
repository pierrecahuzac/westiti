export interface ButtonProps {
  to?: string; 
  onClick?: (e: any) => void;
  children: React.ReactNode; 
  className?: string; 
  type?:"submit" | "reset" | "button";
  disabled?:boolean
}
 