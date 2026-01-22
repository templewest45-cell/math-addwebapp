import { useEffect, useState } from 'react';

interface TeacherInputProps {
    initialValue: string;
    onUpdate: (left: number, right: number) => void;
}

export function TeacherInput({ initialValue, onUpdate }: TeacherInputProps) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Basic parser: looks for "number + number"
        const match = value.match(/(\d+)\s*\+\s*(\d+)/);
        if (match) {
            const left = parseInt(match[1], 10);
            const right = parseInt(match[2], 10);
            if (left + right <= 20) { // Limit total blocks for safety
                onUpdate(left, right);
                setError(false);
            } else {
                setError(true);
            }
        } else {
            // Optional: clear blocks if invalid? Or just ignore.
            // For now, let's just ignore invalid input but show error style
        }
    }, [value, onUpdate]);

    return (
        <div className="w-full max-w-lg mb-8">
            <div className="bg-teal-500 rounded-t-lg p-2 px-4 shadow-md inline-block">
                <span className="text-white font-bold">教材名</span>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-4">
                <label className="text-gray-600 font-semibold mb-[-10px]">式を入力してください (例: 3 + 2)</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`text-4xl font-bold text-center border-b-4 outline-none w-64 pb-2 transition-colors ${error ? 'border-red-400 text-red-500' : 'border-teal-400 text-slate-700 focus:border-teal-600'}`}
                />
                {error && <p className="text-red-500 text-sm">合計が20以下になるようにしてください</p>}
            </div>
        </div>
    );
}
