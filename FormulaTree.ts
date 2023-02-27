//Would be shorter and more efficient as procedural code, but I wanted to have the formula tree as an object
class FormulaTree {
    constructor(private variables: Variable[]) { }

    public addVariable(variable: Variable) {

    }

    public getVariable(name: String): Variable {
        return new Variable("");
    }

    public getVariableInfo(name: String): Object {
        return {};
    }

    public getDependentsForVariable(variable: String): Variable[] {
        return [new Variable("")];
    }

    private calculateVariable(variable: Variable, dependentValues?: Object): Number {
		if (!variable.getFormula()) return variable.getValue();
		var formula = variable.getFormula() || "";
		if (dependentValues) {
			for (const [key, value] of Object.entries(dependentValues)) {
				formula.replaceAll(key, value.toString());
			}
		}
		var oFunction = new Function(formula);
		try {
			var result = new Number(oFunction());
		}
		catch (e) {
			throw new Error("Invalid formula for variable " + variable.getName());
		}
		return result;
    }

    public resolveFormula(variable: Variable): Number {
        if (!variable.hasDependents()) return variable.getValue();
        else {
            let formula = variable.getFormula();
            if (formula) {
                let dependents = variable.getDependents();
                let dependentValues = {};
                for (let i = 0; i < dependents.length; i++) {
                    let dependent = dependents[i];
                    dependentValues[dependent.getName()] = this.resolveFormula(dependent);
                }
                return this.calculateVariable(variable, dependentValues);
            }
		else return variable.getValue();
        }
    }
}

class Variable {
    constructor(private name: string, private formula?: string, private resolved?: boolean, private dependents?: Variable[], private value?: Number, private info?: Object) {
        if (!(this.hasDependents() && formula) && !this.value) throw new Error("Variable must have either a value or formula and dependent variables");
     }

    getInfo(): Object {
        if (this.info) return this.info;
        else return {};
    }

    setInfo(info: Object) {
        this.info = info;
    }

    getValue(): Number {
        if (this.value) return this.value;
        else return 0;
    }

    setValue(value: Number) {
        this.value = value;
    }

    getFormula(): string | undefined {
        if (this.formula) return this.formula;
    }

    getDependents(): Variable[] {
        if (this.dependents) return this.dependents;
        else return [];
    }

    setDependents(dependents: Variable[]) {
        this.dependents = dependents;
    }

    getName(): string {
        return this.name;
    }

    setResolved(resolved: boolean) {
        this.resolved = resolved;
    }

    hasDependents(): boolean {
        if (this.dependents) return this.dependents.length > 0;
        return false;
    }

}