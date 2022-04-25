import React, { useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [row, setRow] = useState([]);
  const [operatorValue, setOperatorValue] = useState({});
  const [calculatorInput, setCalculatorInput] = useState({});
  const [result, setResult] = useState(0);
  const [disabledRow, setDisabledRow] = useState([]);

  useEffect(() => {
    let resultEval = [];
    row.forEach((label, index) => {
      const id = label?.id ? label?.id : index;
      if (!disabledRow.includes(id)) {
        resultEval.push(
          operatorValue?.[`operator${id}`]
            ? operatorValue?.[`operator${id}`]
            : "+"
        );
        resultEval.push(
          calculatorInput?.[`calculatorInput${id}`]
            ? calculatorInput?.[`calculatorInput${id}`]
            : 0
        );
      }
    });
    console.log("resultEval", resultEval);
    let finalResult = eval(resultEval?.join()?.replaceAll(/,/gi, ""));
    setResult(finalResult);
  }, [calculatorInput, disabledRow, operatorValue, row]);

  const handleChangeSelect = useCallback((value, length) => {
    setOperatorValue((prevState) => ({
      ...prevState,
      ["operator" + length]: value,
    }));
  }, []);

  const handleChangeInput = useCallback((value, length) => {
    setCalculatorInput((prevState) => ({
      ...prevState,
      ["calculatorInput" + length]: value ? value : 0,
    }));
  }, []);

  const deleteRow = useCallback(
    (deleteIndex) => {
      delete operatorValue[`operator${deleteIndex}`];
      delete calculatorInput[`calculatorInput${deleteIndex}`];
      const deletedRow = row.filter((el) => el.id !== deleteIndex);
      setRow(deletedRow);
    },
    [calculatorInput, operatorValue, row]
  );

  console.log("finalValue", operatorValue, calculatorInput, row);

  const addRow = useCallback(() => {
    const newRow = {
      id: row.length,
    };
    setRow([...row, newRow]);
  }, [row]);

  const handleDisableRow = useCallback(
    (disableIndex) => {
      if (disabledRow.includes(disableIndex)) {
        const disabledValue = disabledRow.filter((el) => el !== disableIndex);
        setDisabledRow(disabledValue);
      } else {
        setDisabledRow([...disabledRow, disableIndex]);
      }
    },
    [disabledRow, setDisabledRow]
  );

  return (
    <div className="App">
      <button onClick={addRow}>Add Row</button>
      {row.map((data, index) => {
        const id = data?.id ? data?.id : index;
        return (
          <div className="rowContainer" key={index}>
            {/* {data.el} */}
            <div className="container">
              <select
                name={`operator${id}`}
                value={
                  operatorValue?.[`operator${id}`]
                    ? operatorValue?.[`operator${id}`]
                    : "+" || "+"
                }
                id={`operator${id}`}
                onChange={(e) => handleChangeSelect(e.target.value, id)}
                defaultValue="+"
                disabled={disabledRow.includes(id)}
              >
                <option value="+">+</option>
                <option value="-">-</option>
              </select>
              <input
                min={0}
                type={"number"}
                name={`calculatorInput${id}`}
                value={
                  calculatorInput?.[`calculatorInput${id}`]
                    ? calculatorInput?.[`calculatorInput${id}`]
                    : ""
                }
                onChange={(e) => handleChangeInput(e?.target?.value, id)}
                disabled={disabledRow.includes(id)}
              />
            </div>
            <button
              onClick={() => deleteRow(id)}
              disabled={disabledRow.includes(id)}
            >
              Delete
            </button>
            <button onClick={() => handleDisableRow(id)}>
              {disabledRow.includes(id) ? "Enable" : "Disable"}
            </button>
          </div>
        );
      })}
      <h2>Results: {result ? result : 0}</h2>
    </div>
  );
}

export default App;
