import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty/note2.svg" height={140} width={140} alt="empty" />
      <h2 className="text-2xl font-semibold mt-6">No favorites boards</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Make a favorite board first
      </p>
    </div>
  );
};
