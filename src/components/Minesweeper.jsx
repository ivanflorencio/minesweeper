import { useEffect, useState } from "react";
import flag from "./flag.svg";
import bomb from "./bomb.svg";
import "./Minesweeper.css";

function Minesweeper() {
    const [bombCount, setBombCount] = useState(10);
    const [height, setHeight] = useState(10);
    const [width, setWidth] = useState(16);
    const [fields, setFields] = useState([]);

    useEffect(() => {
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
        index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let total = 0;
                ["up", "down", "left", "right", "left-up", "left-down", "right-up", "right-down"].forEach((type) => {
                    total += checkNeighbor(fields, type, x, y);
                });

                fields[index] = { ...fields[index], value: !fields[index].hasBomb ? total : fields[index].value };
                index++;
            }
        }
        setFields(fields);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const checkNeighbor = (fields, type, x, y) => {
        let position = [];
        switch (type) {
            case "up":
                position = [y - 1, x];
                break;
            case "down":
                position = [y + 1, x];
                break;
            case "left":
                position = [y, x - 1];
                break;
            case "right":
                position = [y, x + 1];
                break;
            case "left-up":
                position = [y - 1, x - 1];
                break;
            case "left-down":
                position = [y + 1, x - 1];
                break;
            case "right-up":
                position = [y - 1, x + 1];
                break;
            case "right-down":
                position = [y + 1, x + 1];
                break;
            default:
                break;
        }
        let neighbor = fields.find((i) => JSON.stringify(i.position) === JSON.stringify(position));
        return neighbor && neighbor.hasBomb ? 1 : 0;
    };
    const revealNeighbors = (field) => {
        //TODO
    };
    const handleFieldClick = (field) => {
        const newFields = fields.map((i) => {
            if (field.id === i.id) {
                i.status = "visible";
                if (i.value === 0) revealNeighbors(field);
            }
            return i;
        });
        setFields(newFields);
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
    return (
        <div className="container" style={{ width: `${width * 80}px`, height: `${height * 80}px` }}>
            {fields.map((field) => (
                <div key={field.id}>
                    {field.status === "visible" ? (
                        <div className={`field visible val_${field.value}`} onContextMenu={(e) => handleFieldAuxClick(field, e)} onClick={() => handleFieldClick(field)}>
                            {field.value === "X" ? <img src={bomb} alt="" /> : field.value === 0 ? "" : field.value}
                        </div>
                    ) : field.status === "locked" ? (
                        <div className="field locked" onContextMenu={(e) => handleFieldAuxClick(field, e)}>
                            <img src={flag} alt="" />
                        </div>
                    ) : (
                        <div className="field hidden" onContextMenu={(e) => handleFieldAuxClick(field, e)} onClick={() => handleFieldClick(field)}></div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Minesweeper;
