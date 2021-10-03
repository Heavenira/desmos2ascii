let optimizeForParsing = true;


function desmos2ascii(input) {
	// FUNCTIONS
	// returns the first match's index
	function find(expr) {
		return input.search(expr);
	}

	// returns the last match's index (requires global expr)
	function findFinal(expr) {
		let recent = [...input.matchAll(expr)];
		if (recent[recent.length - 1] != undefined) {
			return recent[recent.length - 1].index;
		}
		recent = -1;
		return recent;
	}

	// replaces all matches with replacement
	function replace(expr, replacement) {
		input = input.replace(expr, replacement);
	}

	// inserts replacement at given index
	function insert(index, replacement) {
		if (index >= 0) {
			input = input.slice(0, index) + replacement + input.slice(index, input.length);
		}
	}

	// overwrites current index with replacement
	function overwrite(index, replacement) {
		input = input.slice(0, index) + replacement + input.slice(index + 1, input.length);
	}

	// iterates the bracket parser with {} in mind
	function bracketEval() {
		if (input[i] == ")" || input[i] == "}" || input[i] == "]") {
			bracket += 1;
		}
		else if (input[i] == "(" || input[i] == "{" || input[i] == "[" || input[i] == "【") {
			bracket -= 1;
		}
	}

	// checks if its an operator


	function isOperator(x) {
		return ["+", "-", "±", "*", "^", "_", "=", ">", "<", "≥", "≤", "≠", ":", "→", "/", "%", "(", ")", "‹", "›", "«", "»", "[", "]", ",", "Ⓧ", "Ⓨ", "【"].includes(input[x]);
	}

	function isBracket(x) {
		return ["(", ")", "‹", "›", "«", "»", "[", "]", "【"].includes(input[x])
	}

	function isDigit(x) {
		return !isNaN(input[x]) || input[x] == ".";
	}

	function isLetter(x) {
		return !isOperator(x) && !isDigit(x);
	}

	function isAssociativeOperator(x) {
		return !["+", "-", "±", "=", ">", "<", "≥", "≤", "≠", "→", "(", ")", "‹", "›", "«", "»", "[", "]", ",", " "].includes(input[x]);
	}

	// PREPARATIONS
	// predefine some variables.
	let i;
	let bracket;
	let startingIndex;
	let selection;
	let subscriptLayers;
	let functionMode;
	// removes whitespace
	replace(/\\\s+/g, "");
	replace(/^\s*/, "");
	replace(/(?<!\\(?:log|ln|(?:arc|)(?:sin|cos|tan|csc|sec|cot)(?:h|))(?:\^|)) /g, "");
	
	// bracket replacements
	replace(/\\left\|/g, "‹");
	replace(/\\right\|/g, "›");
	replace(/\\left\\\{/g, "«");
	replace(/\\right\\\}/g, "»");
	replace(/\\left\[/g, "[");
	replace(/\\right\]/g, "]");
	replace(/\\left/g, "(");
	replace(/\\right/g, ")");
	
	// symbol replacements
	replace(/\\cdot|\\times/g, "*");
	replace(/\\div/g, "/");
	replace(/\\pm/g, "±");
	replace(/\\to/g, "→");
	replace(/\\ge/g, ">=");
	replace(/\\le/g, "<=");
	replace(/(?<=\\operatorname{\w*)}/g, "");
	replace(/\\operatorname{/g, "\\");
	replace(/\\log(?!_)/g, "\\log_(10)");
	replace(/\.x/g, "Ⓧ");
	replace(/\.y/g, "Ⓨ");

	// latin replacements
	replace(/\\alpha/g, "α");
	replace(/\\beta/g, "β"); 
	replace(/\\Gamma/g, "Γ");
	replace(/\\gamma/g, "γ");
	replace(/\\Delta/g, "Δ");
	replace(/\\delta/g, "δ");
	replace(/\\epsilon/g, "ε");
	replace(/\\zeta/g, "ζ");
	replace(/\\eta/g, "η");
	replace(/\\Theta/g, "Θ");
	replace(/\\theta/g, "θ");
	replace(/\\iota/g, "ι"); 
	replace(/\\kappa/g, "κ");
	replace(/\\Lambda/g, "Λ");
	replace(/\\lambda/g, "λ");
	replace(/\\mu/g, "μ");
	replace(/\\nu/g, "ν");
	replace(/\\Xi/g, "Ξ");
	replace(/\\xi/g, "ξ");
	replace(/\\Pi/g, "Π");
	replace(/\\pi/g, "π");
	replace(/\\rho/g, "ρ");
	replace(/\\Sigma/g, "Σ");
	replace(/\\sigma/g, "σ");
	replace(/\\tau/g, "τ");
	replace(/\\Upsilon/g, "Τ");
	replace(/\\upsilon/g, "υ");
	replace(/\\Phi/g, "Φ");
	replace(/\\phi/g, "φ");
	replace(/\\chi/g, "χ");
	replace(/\\Psi/g, "Ψ");
	replace(/\\psi/g, "ψ");
	replace(/\\Omega/g, "Ω");
	replace(/\\omega/g, "ω");

	// implement fractions
	while (find(/\\frac{/) != -1) {
		i = find(/\\frac{/);
		replace(/\\frac{/, "");
		insert(i, "(");
		bracket = -1
		while (i < input.length) {
			i++;
			bracketEval();
			if (bracket == 0) {
				overwrite(i, ")");
				i += 1;
				overwrite(i, "/(")
				break;
			}
		}
		while (i < input.length) {
			i++;
			bracketEval();
			if (bracket == 0) {
				overwrite(i, ")");
				break;
			}
		}
	}

	// convert nth root to exponent
	while (find(/\\sqrt\[/) != -1) {
		startingIndex = find(/\\sqrt\[/);
		i = startingIndex + 5;
		bracket = -1;
		while (i < input.length) {
			i++;
			bracketEval();
			if (bracket == 0) {
				selection = input.slice(startingIndex + 6, i);
				input = input.slice(0, startingIndex) + input.slice(i + 1, input.length);
				break;
			}
		}
		i = startingIndex;
		bracket = -1;
		while (i < input.length) {
			i++;
			bracketEval();
			if (bracket == 0) {
				insert(i + 1, "^(1/(" + selection + "))");
				break;
			}
		}
	}

	// restrict to () brackets
	replace(/{/g, "(");
	replace(/}/g, ")");


	// MAKE SURE TO OPTIMIZE LOGARITHMS BEFOREHAND
	if (optimizeForParsing) {
		// ensure that all logs are evaluated as natural logs
		while (find(/\\log_\(/) != -1) {
			startingIndex = find(/\\log_\(/);
			i = startingIndex + 5;
			bracket = -1;
			while (i < input.length) {
				i++;
				bracketEval();
				if (bracket == 0) {
					selection = input.slice(startingIndex + 5, i + 1)
					input = input.slice(0, startingIndex + 4) + input.slice(i + 1, input.length)
					break;
				}
			}
			
			i = startingIndex + 4;
			if (input[i] != "(") {
				insert(i, "(");
				while (i < input.length) {
					i++;
					if (i == input.length || !isAssociativeOperator(i)) {
						insert(i, ")");
						break;
					}
				}
			}
			else {
				bracket = -1;
				while (i < input.length) {
					i++;
					bracketEval();
					if (bracket == 0) {
						break;
					}
				}
			}
			insert(i + 1, ")/(\\log" + selection + ")");
			insert(startingIndex, "(")
		}

		// ADD NECESSERARY FUNCTION BRACKETS
		while (find(/\\(?!sum|prod|int)/) != -1) {
			functionMode = true;
			startingIndex = find(/\\(?!sum|prod|int)/);
			i = startingIndex;
			overwrite(startingIndex, "✅");
			while (i < input.length) {
				i++;
				if (isLetter(i)) {
					continue;
				}
				if (input[i] == "^") {
					functionMode = false;
					bracket = 0;
					while (i < input.length) {
						i++;
						bracketEval();
						if (bracket == 0) {
							i++;
							break;
						}
					}
				}
				// this is a special bracket and will prevent * symbols being placed next to it
				if (input[i] == "(") {
					overwrite(i, "【");
					break;
				}
				if (input[i] == " ") {
					overwrite(i, "【");
				}
				else {
					insert(i, "【");
				}
				while (i < input.length) {
					i++;
					if (i == input.length || !isAssociativeOperator(i)) {
						insert(i, ")");
						i = input.length;
					}
				}
			}
		}
	}
	replace(/✅/g, "\\");

	// remove double brackets
	while (find(/(\(|【)\(/) != -1) {
		startingIndex = find(/(\(|【)\(/);
		selection = input[startingIndex];
		i = startingIndex + 1;
		bracket = -2;
		while (i < input.length) {
			i++;
			bracketEval();
			while (bracket == -1) {
				i++;
				bracketEval();
				if (bracket == 0) { // delete bracket
					overwrite(startingIndex + 1, "❌")
					overwrite(i, "❌")
					i = input.length;
				}
				if (bracket == -2) { // keep bracket
					if (selection == "【") {
						overwrite(startingIndex, "💯");
					}
					else {
						overwrite(startingIndex, "✅");
					}
					i = input.length;
				}
			}
		}
	}
	replace(/❌/g, "");
	replace(/✅/g, "(");
	replace(/💯/g, "【");
	replace(/‹/g, "\\abs(");
	replace(/›/g, ")");

	if (optimizeForParsing) {
		// use % notation for modulo
		while (find(/\\mod【/) != -1) {
			startingIndex = find(/\\mod【/);
			i = startingIndex + 4;
			bracket = -1;
			while (i < input.length) {
				i++;
				bracketEval();
				if (bracket == -1 && input[i] == ",") {
					overwrite(i, ")%(");
					replace(/\\mod【/, "(");
				}
				if (bracket == 0) {
					replace(/\\mod【/, "❌");
				}
			}
		}
		replace(/❌/g, "\\mod(");

		// implement * operators
		bracket = 0;
		subscriptLayers = 0;
		functionMode = false;
		for (i = 0; i < input.length - 1; i++) {
			// ignore asterix insertion within subscripts
			if (input[i] == "_") {
				subscriptLayers -= 1;
				continue;
			}
			if (subscriptLayers < 0) {
				bracketEval();
				subscriptLayers = bracket;
				if (subscriptLayers == 0 && isLetter(i + 1)) {
					i -= 1;
				}
				continue;
			}

			// ignore asterix insertion within function names
			if (input[i] == "\\") {
				functionMode = true;
				continue;
			}
			if (functionMode) {
				if (!isLetter(i)) {
					functionMode = false;
				}
				continue;
			}

			// all the scenarios where an asterix should be placed
			if (
				// two wayward brackets are next to eachother
				(input[i] == ")" && input[i + 1] == "(") ||
				// a digit proceeds a bracket
				(isDigit(i) && input[i + 1] == "(") ||
				// a bracket proceeds a digit OR letter
				(input[i] == ")" && (isDigit(i + 1) || isLetter(i + 1))) ||
				// a bracket proceeds a digit OR letter
				(isDigit(i) && input[i + 1] == "(") ||
				// two letters next to each other
				(isLetter(i) && isLetter(i + 1)) ||
				// digit after OR before letter
				((isDigit(i) && isLetter(i + 1)) || (isLetter(i) && isDigit(i + 1)))
				) {
				insert(i + 1, "*");
				i++;
				continue;
			}
		}

		// attention to detail: remove unnecessary * after sum|prod|int 
		while (find(/\\(sum|prod|int)/) != -1) {
			startingIndex = find(/\\(sum|prod|int)/);
			i = startingIndex;
			bracket = 0;
			let layers;
			for (j = 0; j < 2; j++) {
				layers = 0
				while (i < input.length) {
					i++;
					bracketEval();
					if (bracket < 0) {
						layers = 1;
					}
					if (bracket == 0 && layers == 1) {
						break;
					}
				}
			}
			if (input[i + 1] == "*") {
				overwrite(i + 1, " ");
			}
			else {
				insert(i + 1, " ");
			}
			overwrite(startingIndex, "✅");
		}
		replace(/✅/g, "\\");

		// inverse trigonometry optimizations
		replace(/\\(?=(?:sin|cos|tan|csc|sec|cot)(?:h|)\^\(-1\))/g, "\\arc");
		replace(/(?<=\\arc(?:sin|cos|tan|csc|sec|cot)(?:h|))\^\(-1\)/g, "");
	}

	// remove redundant brackets
	while (find(/\(/) != -1) {
		startingIndex = find(/\(/);
		i = startingIndex;
		if (!isOperator(i - 1) && input[i - 1] != "✅") {
			overwrite(startingIndex, "✅");
			continue;
		}
		bracket = -1;
		while (i < input.length) {
			i++;
			bracketEval();
			if (bracket == -1) {
				if (input[i] == "_") {
					i++;
					bracket -= 1;
					continue;
				}
				if (isOperator(i)) {
					overwrite(startingIndex, "✅");
					break;
				}
			}
			if (bracket == 0) {
				overwrite(i, "❌")
				overwrite(startingIndex, "❌")
				break;
			}
		}
	}	
	replace(/❌/g, "");
	replace(/✅/g, "(");

	// final replacements
	replace(/【/g, "(");
	if (optimizeForParsing) {
		replace(/\^/g, "**");
		replace(/π/g, "pi")
	}

	replace(/«/g, "{");
	replace(/»/g, "}");

	replace(/\\/g, "");
	replace(/Ⓧ/g, ".x");
	replace(/Ⓨ/g, ".y");
	console.log(input+"\n")
	return input;
}

// Always love to have my signature :)
console.log(
	"desmos2ascii loaded properly ✔✅\n_   _ _____ ___  _   _ _____ _   _ ___________  ___  \n| | | |  ___/ _ \\| | | |  ___| \\ | |_   _| ___ \\/ _ \\ \n| |_| | |__/ /_\\ | | | | |__ |  \\| | | | | |_/ / /_\\ \\\n|  _  |  __|  _  | | | |  __|| . ` | | | |    /|  _  |\n| | | | |__| | | \\ \\_/ | |___| |\\  |_| |_| |\\ \\| | | |\n\\_| |_\\____\\_| |_/\\___/\\____/\\_| \\_/\\___/\\_| \\_\\_| |_/"
);
