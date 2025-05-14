
export interface ExploreHeaderProps {
  title: string;
}

const ExploreHeader = ({ title }: ExploreHeaderProps) => {
  return (
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
  );
};

export default ExploreHeader;
