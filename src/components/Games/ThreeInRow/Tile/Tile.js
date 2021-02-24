import cn from "classnames";
import css from "./Tile.module.css";
import React from "react";

const Tile = ({onHandlerClick, item, size = 50}) => {
    const classNames = cn(
        css.item,
        css["item_" + item.value],
        {[css.active]    : item.active},
        {[css.allowed]   : item.allowed},
        {[css.delete]    : item.delete},
        {[css.appearance]: item.appearance}
    )
    const style = {
        width: (size - 100/20) + "px",
        height: (size - 100/20) + "px",
        top: item.y,
        left: item.x
    }
    return (
        <div
            onClick={() => onHandlerClick(item)}
            style={style}
            key={item.id}
            className={classNames}>
            {/*{item.value}*/}
        </div>
    )
}

export default Tile