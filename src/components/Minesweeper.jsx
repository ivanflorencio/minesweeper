import { useEffect, useState } from "react";
import flag from "./flag.svg";
import bomb from "./bomb.svg";
import "./Minesweeper.css";

function Minesweeper() {
    const [bombCount, setBombCount] = useState(10);
    const [height, setHeight] = useState(10);
    const [width, setWidth] = useState(10);
    const [fields, setFields] = useState([]);
    const [youLose, setYouLose] = useState(false);
    const [youWin, setYouWin] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        newGame();
    }, [height, width, bombCount]); // eslint-disable-line react-hooks/exhaustive-deps

    const newGame = () => {
        let fields = [];
        let index = 0;
        //Empty fields
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                fields[index] = { id: `${y}_${x}`, value: 0, position: [y, x], hasBomb: false, status: "hidden", index };
                index++;
            }
        }
        //Bombs
        for (let i = 0; i < bombCount; i++) {
            const position = Math.round(Math.random() * height * width);
            let field = fields[position];
            if (field && field.value === 0) {
                fields[position] = { ...fields[position], value: "X", hasBomb: true };
            } else {
                i--;
            }
        }
        //Numbering
        fields.forEach((field) => {
            if (!field.hasBomb) {
                let neighbors = getNeighbors(field, fields);
                field.value = neighbors.reduce((acc, curr) => (acc += curr && curr.hasBomb ? 1 : 0), 0);
            }
        });
        setFields(fields);
        setYouLose(false);
        setYouWin(false);
        setStarted(false);
    };
    const getNeighbors = (field, fields) => {
        const x = field.position[1];
        const y = field.position[0];
        return [
            [y - 1, x],
            [y + 1, x],
            [y, x - 1],
            [y, x + 1],
            [y - 1, x - 1],
            [y + 1, x - 1],
            [y - 1, x + 1],
            [y + 1, x + 1],
        ].map((position) => {
            return fields.find((i) => JSON.stringify(i.position) === JSON.stringify(position));
        });
    };
    const revealNeighbors = (field) => {
        let items = getNeighbors(field, fields);
        items.forEach((item) => {
            if (item && item.status !== "visible") {
                revealField(item);
                if (item.value === 0) revealNeighbors(item);
            }
        });
    };
    const handleFieldClick = (field) => {
        if (field.hasBomb) lose();
        if (field.value === 0) revealNeighbors(field);
        getNeighbors(field, fields);
        revealField(field);
        checkWin();
    };
    const handleFieldAuxClick = (field, evt) => {
        evt.preventDefault();
        const newFields = fields.map((i) => {
            if (field.id === i.id) {
                if (i.status === "hidden") {
                    i.status = "locked";
                } else if (i.status === "locked") {
                    i.status = "hidden";
                }
            }
            return i;
        });
        setFields(newFields);
    };
    const revealField = (field) => {
        const newFields = fields.map((i) => {
            if (field.id === i.id) {
                i.status = "visible";
            }
            return i;
        });
        setFields(newFields);
    };
    const revealAll = () => {
        const newFields = fields.map((i) => {
            i.status = "visible";
            return i;
        });
        setFields(newFields);
    };
    const checkWin = () => {
        const remainingHidden = fields.filter((i) => i.status !== "visible").length;
        if (remainingHidden === bombCount) win();
    };
    const lose = () => {
        revealAll();
        setYouLose(true);
    };
    const win = () => {
        revealAll();
        setYouWin(true);
    };
    return (
        <>
            <div class="tools">
                <label>Width:</label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                <label>Height:</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                <label>Bombs:</label>
                <input type="number" value={bombCount} onChange={(e) => setBombCount(e.target.value)} />
                <button onClick={() => setStarted(true)}>New Game</button>
            </div>
            <div className={`container ${started ? "" : "blocked"}`} style={{ width: `${width * 80}px`, height: `${height * 80}px` }}>
                {fields.map((field) => (
                    <div key={field.id}>
                        {field.status === "visible" ? (
                            <div
                                className={`field visible ${youWin ? "win" : ""} val_${field.value}`}
                                onContextMenu={(e) => handleFieldAuxClick(field, e)}
                                onClick={() => handleFieldClick(field)}
                            >
                                {field.value === "X" ? <img src={bomb} alt="" /> : field.value === 0 ? "" : field.value}
                            </div>
                        ) : field.status === "locked" ? (
                            <div className="field locked" onContextMenu={(e) => handleFieldAuxClick(field, e)}>
                                <img src={flag} alt="" />
                            </div>
                        ) : (
                            <div className="field hidden" onContextMenu={(e) => handleFieldAuxClick(field, e)} onClick={() => handleFieldClick(field)} />
                        )}
                    </div>
                ))}
                {youLose && (
                    <dialog open>
                        YOU LOSE! <button onClick={() => newGame()}>OK</button>
                    </dialog>
                )}
                {youWin && (
                    <dialog open>
                        YOU WIN! <button onClick={() => newGame()}>OK</button>
                    </dialog>
                )}
            </div>
        </>
    );
}

export default Minesweeper;
