'use client'

import React, { useState, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingScreen } from "@/components/ui/loading";


import targetPairs from "@/lib/targetPairs";

export function MinusPermuteCombinatorics() {
  const [numbers, setNumbers] = useState(Array(12).fill(""))
  const [permuteN, setPermuteN] = useState(2)
  const [chooseN, setChooseN] = useState(2)
  const [permutedResult, setPermutedResult] = useState<string[][]>([])
  const [analyticsData, setAnalyticsData] = useState<[string, number][]>([])
  const tbl = useRef<HTMLTableElement | null>(null);

  // Initialize state with an explicit type of number[]
  const [modResults, setModResults] = useState<number[]>([]);


  const [loading, setLoading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const updatedNumbers = [...numbers];
    updatedNumbers[index] = value;
    setNumbers(updatedNumbers);
  }

  const getPermutations = (arr: string[], permuteN: number): string[][] => {
    setLoading(true);
    if (permuteN === 1) return arr.map((item) => [item])
    const permutations: string[][] = []
    arr.forEach((item, index) => {
      const remaining = arr.slice(0, index).concat(arr.slice(index + 1))
      getPermutations(remaining, permuteN - 1).forEach((perm) =>
        permutations.push([item, ...perm])
      )
    });
    setLoading(false);
    return permutations;
  }

  const handlePermute = () => {
    if (permuteN < 2 || permuteN > 4) {
      alert("Choose n must be between 2 and 4");
      return;
    }
    setLoading(true);
    const filteredNumbers = numbers.filter((num) => num !== "")
    const permutations = getPermutations(filteredNumbers, permuteN)
    setPermutedResult(permutations);
    setLoading(false);
  }

  const getCombinations = (chooseN: number, tableData: string[][]): number[] => {


    // Extract all the numbers from the permuted result table as a flat array
    const numbers = tableData.flat().map((num) => parseInt(num)).filter((num) => !isNaN(num));

    // Check if the input is valid
    if (chooseN < 2 || chooseN > 4) {
      alert("Choose n must be between 2 and 4");
      return [];
    }

    let results: number[] = [];

  // Function to calculate the "choose n" subtractions and return modulus 90
  const combinations = (arr: number[], n: number, start = 0, currentCombo: number[] = []) => {
      if (currentCombo.length === n) {
        const subtraction = currentCombo.reduce((acc, val) => acc - val, currentCombo[0] * 2);
        results.push(((subtraction % 90) + 90) % 90); // Ensure non-negative modulus
        return;
      }

      for (let i = start; i < arr.length; i++) {
        combinations(arr, n, i + 1, [...currentCombo, arr[i]]);
      }
    };

    // Run combinations calculation
    combinations(numbers, chooseN);

    return results;
  };

  const handleCalculate = () => {
    if (chooseN < 2 || chooseN > 4) {
      alert("Choose n must be between 2 and 4");
      return;
    }

    // Assuming `permutedResult` is your table data containing numbers
    const modResults = getCombinations(chooseN, permutedResult);

    // Set the results
    setModResults(modResults);

    confirm(`Minus Choose ${chooseN} generated and calculated with mod 90`);
  };


  const handleRandomize = () => {
    setLoading(true);
    setModResults((prev) => [...prev].sort(() => Math.random() - 0.5));
    setLoading(false);

  }

  const handleResultCheck = () => {
    setLoading(true);

    // Access table cells using the ref
    const tableCells = tbl.current?.querySelectorAll("td");
    if (!tableCells) {
      setLoading(false);
      return;
    }
    const analytics: Record<string, Array<[HTMLElement, HTMLElement]>> = {}; // Store cell pairs
    const pairOccurrences: Record<string, number> = {}; // Store occurrences count

    // Clear previous highlights
    tableCells.forEach((cell) =>
      cell.classList.remove("bg-purple-500", "text-white")
    );

    // Traverse each cell to check for adjacent pairs
    for (let i = 0; i < tableCells.length - 1; i++) {
      const currentCell = tableCells[i];
      const nextCell = tableCells[i + 1];
      const currentNum = currentCell.innerText.trim();
      const nextNum = nextCell.innerText.trim();

      // Check if the current pair matches any of the target patterns
      targetPairs.forEach(([first, second]) => {
        if (currentNum === first && nextNum === second) {
          const pairKey = `${first} ${second}`;

          // Track occurrences count
          pairOccurrences[pairKey] = (pairOccurrences[pairKey] || 0) + 1;

          // Store cell pairs for highlighting if they appear more than once
          if (analytics[pairKey]) {
            analytics[pairKey].push([currentCell, nextCell]);
          } else {
            analytics[pairKey] = [[currentCell, nextCell]];
          }
        }
      });
    }

    // Highlight pairs that appear more than once
    const highlightedData: Array<[string, number]> = [];
    Object.entries(analytics).forEach(([pairKey, cellPairs]) => {
      if (pairOccurrences[pairKey] > 1) {
        cellPairs.forEach(([currentCell, nextCell]) => {
          currentCell.classList.add("bg-purple-500", "text-white");
          nextCell.classList.add("bg-purple-500", "text-white");
        });
        highlightedData.push([pairKey, pairOccurrences[pairKey]]); // Add pair and occurrence count
      }
    });

    // Update analyticsData with pairs that have more than 1 occurrence
    setAnalyticsData(
      highlightedData.length > 0 ? highlightedData : [["No pairs found", 0]]
    );
    setLoading(false);
  };


  return (
    <div className="w-full container mx-auto p-4 space-y-8">
      {loading && <LoadingScreen />}
      <Card className="">
        <CardHeader>
          <CardTitle className="text-center">Minus Combinatorics and Permutation Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-col-7 lg:grid-col-15  gap-2 mb-4">
            {numbers.map((num, index) => (
              <Input
                className="border border-gray-500 px-1 text-center"
                key={index}
                type="number"
                value={num}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`i${index + 1}`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min={2}
                max={7}
                value={permuteN}
                onChange={(e) => setPermuteN(parseInt(e.target.value))}
                className="w-20"
              />
              <Button className="bg-fuchsia-600" onClick={handlePermute}>Permute {permuteN}</Button>
            </div>

            <div className="w-full bg-fuchsia-600 text-white text-center text-2xl py-3">Permuted Numbers</div>
            <Suspense fallback={<LoadingScreen />}>
              {permutedResult.length > 0 && (
                <Table>
                  <TableCaption>Permuted Numbers</TableCaption>
                  <TableBody>
                    {permutedResult.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell className="text-center" key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Suspense>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min={2}
                max={7}
                value={chooseN}
                onChange={(e) => setChooseN(parseInt(e.target.value))}
                className="w-20"
              />
              <Button className="bg-fuchsia-600" onClick={handleCalculate}>Calculate Choose {chooseN}</Button>
            </div>

            <div className="w-full bg-fuchsia-600 text-2xl text-white text-center py-3">Combination Numbers</div>

            <Suspense fallback={<LoadingScreen />}>
              <Table ref={tbl}>
                <TableBody>
                  {Array.from({ length: Math.ceil(modResults.length / 15) }).map((_, rowIndex) => (
                   
                   <TableRow key={rowIndex}>
                      {modResults
                        .slice(rowIndex * 15, (rowIndex + 1) * 15)
                        .map((result, colIndex) => (
                          <TableCell
                            key={`${rowIndex}-${colIndex}`}
                            className="text-center"
                          >
                            {result}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </Suspense>

            <div className="flex gap-2">
              <Button className="bg-fuchsia-600" onClick={handleRandomize}>Randomize</Button>

              <Button className="bg-fuchsia-600" onClick={handleResultCheck}>Check Results</Button>
            </div>

            <div className="w-full bg-fuchsia-600 text-white text-center py-3">Analytics Data</div>
            {analyticsData.length > 0 && (
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Occurrences</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.map(([pair, occurrences], index) => (
                      <TableRow key={index}>
                        <TableCell>{pair}</TableCell>
                        <TableCell>{occurrences}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}