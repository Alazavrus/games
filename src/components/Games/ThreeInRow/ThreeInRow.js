import {useState, useEffect, useCallback} from "react";
import css from "./ThreeInRow.module.css";
import Tile from "./Tile/Tile";

const getRandomInt = (max) => {
    return Math.ceil(Math.random() * max);
}
const getRandomIntWithException = (max, exceptions) => {
    let value = getRandomInt(max);
    return exceptions.some(el => el === value) ? getRandomIntWithException(max, exceptions) : value
}

const isThreeInRow = (item, arr, sizeTiles) => {
    let val = item.value;
    let x   = item.x;
    let y   = item.y;

    const is = (val, val2) => {
        return val && val.value === val2
    }
    let bottom1 = arr.find(el => el.y === y - sizeTiles && el.x === x);
    let bottom2 = arr.find(el => el.y === y - (sizeTiles * 2) && el.x === x);
    let top1    = arr.find(el => el.y === y + sizeTiles && el.x === x);
    let top2    = arr.find(el => el.y === y + (sizeTiles * 2) && el.x === x);

    let left1   = arr.find(el => el.x === x - sizeTiles && el.y === y);
    let left2   = arr.find(el => el.x === x - (sizeTiles * 2) && el.y === y);
    let right1  = arr.find(el => el.x === x + sizeTiles && el.y === y);
    let right2  = arr.find(el => el.x === x + (sizeTiles * 2) && el.y === y);

    return (is(left1, val)    && is(left2, val))
        || (is(right1, val)   && is(right2, val))
        || (is(left1, val)    && is(right1, val))
        || (is(bottom1, val)  && is(bottom2, val))
        || (is(top1, val)     && is(top2, val))
        || (is(top1, val)     && is(bottom1, val))
}
const setIsTileThreeInRow = (arr, sizeTiles) => {
    return arr.map((item) => ({
        ...item,
        delete: isThreeInRow(item, arr, sizeTiles)
    }))
}
const genMatrix = (num) => {
    let arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(i)
    }
    return arr
}

const swapItemsInArray = (item1, item2, arr) => {
    return arr.map(el => {
        if(el.id === item1.id) {
            return {...item2, x: item1.x, y: item1.y}
        } else if(el.id === item2.id) {
            return {...item1, x: item2.x, y: item2.y}
        } else {
            return el
        }
    })
}

const isAllowed = (item, listItem, sizeTiles) => {
    const top    = item.x === listItem.x && listItem.y + sizeTiles === item.y;
    const right  = listItem.x === item.x + sizeTiles && item.y === listItem.y;
    const bottom = item.x === listItem.x && listItem.y - sizeTiles === item.y;
    const left   = listItem.x === item.x - sizeTiles  && item.y === listItem.y;
    return top || bottom || right || left
}

const ThreeInRow = ({countHorizontalTiles, countVerticalTiles, countTypeTiles, sizeTiles}) => {
    const [isCheck, setIsCheck] = useState(false);
    const [isAccessSelect, setIsAccessSelect] = useState(true);
    const [score, setScore] = useState(0);
    const [selectList, setSelectList] = useState([]);
    const [list, setList] = useState([]);

    const genList = useCallback(() => {
        const row   = () => genMatrix(countHorizontalTiles).map(() => getRandomInt(countTypeTiles) )
        const table = () => genMatrix(countVerticalTiles).map(() => row() )

        return table().reduce((accRows, row, rowIndex) => {
            let topRow  = accRows[accRows.length - 1];
            let topRow2 = accRows[accRows.length - 2];

            let newRow = row.reduce((acc, val, valIndex) => {
                let leftVal  = acc[acc.length - 1] && acc[acc.length - 1].value;
                let leftVal2 = acc[acc.length - 2] && acc[acc.length - 2].value;
                let topVal   = topRow && topRow[valIndex] && topRow[valIndex].value;
                let topVal2  = topRow2 && topRow2[valIndex] && topRow2[valIndex].value;

                let isTop  = topVal  || topVal2;
                let isLeft = leftVal || leftVal2;

                const setItem = (prevVal, value) => {
                    let defaultItem = {
                        id:  '_' + Math.random().toString(36).substr(2, 9),
                        value: null,
                        x: valIndex * sizeTiles,
                        y: rowIndex * sizeTiles,
                        active: false,
                        appearance: false
                    }
                    let newVal = getRandomIntWithException(countTypeTiles, prevVal)

                    if(prevVal.some(el => el === value)) {
                        return {...defaultItem, value: newVal}
                    } else {
                        return {...defaultItem, value: value}
                    }
                }

                return [...acc, setItem([isTop, isLeft], val )];
            }, []);

            return [...accRows, newRow]
        }, []).flat(1)
    } , [])

    const swapTile = (item1, item2) => {
        setList( prevList => {
            let newArr = swapItemsInArray(item1, item2, prevList);
            if(setIsTileThreeInRow(newArr, sizeTiles).some(el => !!el.delete)) {
                return newArr
            } else {
                return prevList
            }
        });
    }

    const onClickItem = item => {
        if(!isAccessSelect) return
        let length = selectList.length;

        if(length === 0) {
            setSelectList([item])
        } else if (length === 1) {
            if(item.id === selectList[0].id){
                setSelectList([])
            } else if ( isAllowed(item, selectList[0], sizeTiles) ) {
                setSelectList(prevList => [...prevList, item])
            } else {
                setSelectList([item])
            }
        } else if (length === 2) {
            setSelectList([item])
        }
    }

    useEffect(() => {
        if(selectList.length === 2) {
            swapTile({...selectList[0]}, {...selectList[1]});
        } else if(selectList.length === 1) {
            setList( prevList => prevList.map(item => ({
                ...item,
                allowed: isAllowed(item, selectList.length ? selectList[0] : false, sizeTiles),
                active:  selectList.some(el => item.id === el.id),
                appearance: false
            })))
        } else if(selectList.length === 0) {
            setList( prevList => prevList.map(item => ({
                ...item,
                allowed: false,
                active:  false,
                appearance: false
            })))
        }

    }, [selectList])

    useEffect(() => {
        if(isCheck) {
            setList(setIsTileThreeInRow(list, sizeTiles))
        }

        if(list.some(el => !!el.delete)) {
            setIsAccessSelect(false);
            setScore( prevScore => list.reduce((acc, item) => {
                return item.delete ? acc + 100 : acc;
            }, prevScore) );

            let newList = list.map((item) => {
                if(item.delete) {
                    return {
                        ...item,
                        id:  '_' + Math.random().toString(36).substr(2, 9),
                        value: getRandomInt(countTypeTiles),
                        active: false,
                        delete: false,
                        appearance: true
                    }
                } else {
                    return {...item, active: false, delete: false, allowed: false, appearance: false}
                }
            })
            setTimeout(() => {
                setList(newList)
            }, 1000)
            setIsCheck(true)
        } else {
            setIsAccessSelect(true);
            setIsCheck(false);
        }
        if(selectList.length === 2) {
            setSelectList([]);
            setIsCheck(true)
        }
    }, [list])

    useEffect(() => {
        setList(genList())
    }, [])

    return (
        <div className={css.game_container}>
            <div className={css.score}>Счет: {score}</div>
            <div className={css.game}>
                {
                    list.map(item => {
                        return <Tile ref={item.path} key={item.id} size={sizeTiles} onHandlerClick={onClickItem} item={item}/>
                    })
                }
            </div>
        </div>
    )
}

export default ThreeInRow