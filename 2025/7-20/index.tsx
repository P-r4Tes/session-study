import { useState, useRef } from "react";

/**
 *
 * 의찬 : 사용되는 타이머를 컴포넌트화 시켜보기. 상태 나누기 관점
 *
 * 영준 : 홀수짝수 타이머 훅에는 스타일 의존성이 꼭 필요없는 것 같음. 그러니까 컴포넌트화
 * // TODO 도 훅으로 뺴기
 * // 리렌더링시 인터벌 다시도는거 문제있음 start 를 useCallback으로 감싸야한다. clear가 없음. 그러니까 interval이 누적될것.
 *
 * 홍빈 : 타미어훅에 있는 스타일요소를 빼내야할 것 같음. setInterval 에서 새로 함수 생성되는거 최적화해보기
 *
 * 세희 : 타이머 안에 있는 인터벌을 useEffect랑 ref 방식으로 바꿔서 메모리 leak을 방지할 수 있을 것 같음
 *
 */

const Refactoring = () => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const listRef = useRef<HTMLUListElement>(null);

  const { inputRef, todos, newTodo, addTodo, setNewTodo } = useTodo();
  const { timerRef, seconds, isRunning, start, stop, reset } = useTimer();

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>타이머 & 사용자</h3>

          <div
            ref={timerRef}
            style={{
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #ddd",
            }}
          >
            타이머: {seconds}초 ({isRunning ? "실행중" : "정지"})
          </div>

          <div style={{ marginBottom: "10px" }}>
            <button onClick={start}>시작</button>
            <button onClick={stop}>정지</button>
            <button onClick={reset}>리셋</button>
          </div>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          <h3>카운터 & 할일목록</h3>

          <div style={{ marginBottom: "15px" }}>
            <p>카운터: {count}</p>
            <button onClick={() => setCount(count + step)}>+{step}</button>
            <button onClick={() => setCount(count - step)}>-{step}</button>
            <input
              type="number"
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              style={{ width: "60px", margin: "0 10px" }}
            />
          </div>

          <div>
            <input
              ref={inputRef}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="할일 입력"
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <button onClick={addTodo}>추가</button>
            <button onClick={scrollToBottom}>맨 아래로</button>

            <ul
              ref={listRef}
              style={{
                height: "100px",
                overflow: "auto",
                border: "1px solid #eee",
                margin: "10px 0",
              }}
            >
              {todos.map((todo, index) => (
                <li key={index}>{todo}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const useTodo = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return { todos, newTodo, addTodo, inputRef, setNewTodo };
};

const useTimer = () => {
  const timerRef = useRef<HTMLDivElement>(null);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = () => {
    setIsRunning(true);
    setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => setIsRunning(false);
  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return { timerRef, seconds, isRunning, start, stop, reset };
};

export default Refactoring;
