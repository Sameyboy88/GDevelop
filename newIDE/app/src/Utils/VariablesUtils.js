// @flow
import { mapFor } from './MapFor';
import newNameGenerator from './NewNameGenerator';
import { unserializeFromJSObject } from './Serializer';
const gd: libGDevelop = global.gd;

export const hasChildThatContainsStringInNameOrValue = (
  variable: gdVariable,
  searchText: string
): boolean => {
  switch (variable.getType()) {
    case gd.Variable.String:
      return variable
        .getString()
        .normalize('NFD')
        .toLowerCase()
        .includes(searchText);
    case gd.Variable.Number:
      return variable
        .getValue()
        .toString()
        .includes(searchText);
    case gd.Variable.Array:
      return mapFor(0, variable.getChildrenCount(), index => {
        const childVariable = variable.getAtIndex(index);
        return hasChildThatContainsStringInNameOrValue(
          childVariable,
          searchText
        );
      }).some(Boolean);
    case gd.Variable.Structure:
      return variable
        .getAllChildrenNames()
        .toJSArray()
        .map(childName => {
          const childVariable = variable.getChild(childName);
          return (
            childName
              .normalize('NFD')
              .toLowerCase()
              .includes(searchText) ||
            hasChildThatContainsStringInNameOrValue(childVariable, searchText)
          );
        })
        .some(Boolean);
    default:
      return false;
  }
};

export const insertInVariablesContainer = (
  variablesContainer: gdVariablesContainer,
  name: string,
  serializedVariable: ?any,
  index: ?number
): string => {
  const newName = newNameGenerator(
    name,
    name => variablesContainer.has(name),
    serializedVariable ? 'CopyOf' : undefined
  );
  const newVariable = new gd.Variable();
  if (serializedVariable) {
    unserializeFromJSObject(newVariable, serializedVariable);
  } else {
    newVariable.setString('');
  }
  variablesContainer.insert(
    newName,
    newVariable,
    index || variablesContainer.count()
  );
  newVariable.delete();
  return newName;
};

export const insertInVariableChildrenArray = (
  targetParentVariable: gdVariable,
  serializedVariable: any,
  index: number
) => {
  const newVariable = new gd.Variable();
  unserializeFromJSObject(newVariable, serializedVariable);
  targetParentVariable.insertAtIndex(newVariable, index);
  newVariable.delete();
};

export const insertInVariableChildren = (
  targetParentVariable: gdVariable,
  name: string,
  serializedVariable: any
): string => {
  const newName = newNameGenerator(
    name,
    _name => targetParentVariable.hasChild(_name),
    'CopyOf'
  );
  const newVariable = new gd.Variable();
  unserializeFromJSObject(newVariable, serializedVariable);
  targetParentVariable.insertChild(newName, newVariable);
  newVariable.delete();
  return newName;
};

export const hasVariablesContainerSubChildren = (
  variablesContainer: gdVariablesContainer
): boolean =>
  mapFor(0, variablesContainer.count(), index => {
    const variable = variablesContainer.getAt(index);

    return isCollectionVariable(variable) && variable.getChildrenCount() > 0;
  }).some(Boolean);

export const isCollectionVariable = (variable: gdVariable): boolean =>
  !gd.Variable.isPrimitive(variable.getType());