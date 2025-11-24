using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using ClosedXML.Excel;

namespace KPIBomb;

public static class Program
{
    public static int Main(string[] args)
    {
        var input = args.Length > 0 ? args[0] : null;
        input = ResolveExcelPath(input);
        if (input == null)
        {
            Console.Error.WriteLine("No Excel file was provided. Exiting.");
            return 1;
        }

        if (!File.Exists(input))
        {
            Console.Error.WriteLine($"File not found: {input}");
            return 2;
        }

        try
        {
            using var wb = new XLWorkbook(input);
            var ws = wb.Worksheet(1);
            var used = ws.RangeUsed();

            if (used == null)
            {
                Console.Error.WriteLine("Worksheet appears to be empty.");
                return 3;
            }

            var rows = used.RowsUsed().ToList();
            if (rows.Count == 0)
            {
                Console.Error.WriteLine("Worksheet contains no rows.");
                return 4;
            }

            var headerRow = rows.First();
            var headers = headerRow.Cells().Select(c => c.GetString().Trim()).ToList();

            if (headers.Count == 0)
            {
                Console.Error.WriteLine("No header row found in first row.");
                return 5;
            }

            var dataRows = rows.Skip(1).ToList();
            if (dataRows.Count == 0)
            {
                Console.Error.WriteLine("Worksheet contains headers but no data rows.");
                return 6;
            }

            var table = new List<Dictionary<string, object?>>();

            foreach (var r in dataRows)
            {
                var dict = new Dictionary<string, object?>();
                for (int colIndex = 0; colIndex < headers.Count; colIndex++)
                {
                    var cell = r.Cell(colIndex + 1);
                    dict[headers[colIndex]] = cell.Value;
                }
                table.Add(dict);
            }

            var outDir = Path.GetDirectoryName(Path.GetFullPath(input))!;
            Directory.CreateDirectory(outDir);

            var baseName = Path.GetFileNameWithoutExtension(input);
            var outputPath = Path.Combine(outDir, $"{baseName}.out.json");

            var json = JsonSerializer.Serialize(table, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            File.WriteAllText(outputPath, json, new UTF8Encoding(encoderShouldEmitUTF8Identifier: true));

            Console.WriteLine($"OK: wrote {table.Count} rows to '{outputPath}'.");
            return 0;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error processing '{input}': {ex.Message}");
            return 99;
        }
    }

    private static string? ResolveExcelPath(string? initial)
    {
        static string Normalize(string value) => value.Trim().Trim('"');

        if (!string.IsNullOrWhiteSpace(initial))
        {
            var candidate = Normalize(initial);
            if (File.Exists(candidate))
            {
                return candidate;
            }

            Console.WriteLine($"Provided file '{candidate}' was not found.");
        }

        Console.WriteLine("Launch detected with no Excel data.");
        Console.WriteLine("Add the Excel file and paste or drag its full path here when you are ready.");
        Console.WriteLine("Type 'exit' to quit.");

        while (true)
        {
            Console.Write("Excel path> ");
            var entry = Console.ReadLine();
            if (entry == null || entry.Equals("exit", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            entry = entry.Trim();
            if (entry.Length == 0)
            {
                Console.WriteLine("Please provide a file path or type 'exit'.");
                continue;
            }

            var candidate = Normalize(entry);
            if (File.Exists(candidate))
            {
                Console.WriteLine($"Using '{candidate}'.");
                return candidate;
            }

            Console.WriteLine($"No file found at '{candidate}'. Add the Excel file and try again.");
        }
    }
}
