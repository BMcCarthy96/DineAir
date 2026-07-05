import SmartImage from "./SmartImage";

/** Shared menu-item card used on restaurant menus and item detail pages. */
function MenuItemCard({ item, actions, onClick }) {
    const price = !Number.isNaN(Number(item.price))
        ? Number(item.price).toFixed(2)
        : "0.00";
    const Wrapper = onClick ? "button" : "div";

    return (
        <article className="da-card flex flex-col overflow-hidden">
            <Wrapper
                type={onClick ? "button" : undefined}
                onClick={onClick}
                className={onClick ? "block text-left" : undefined}
            >
                <SmartImage src={item.imageUrl} alt="" className="aspect-[4/3] w-full" />
            </Wrapper>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                    {item.name}
                </h3>
                {item.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                    </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                        ${price}
                    </span>
                    {actions}
                </div>
            </div>
        </article>
    );
}

export default MenuItemCard;
