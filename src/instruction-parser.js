/*!
 * https://github.com/leonardosnt/java-class-tools
 *
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

import Opcode from './opcode';

// -1 = variable length
// index = opcode
const opcodeOperandCount = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2,
  2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 1, -1, -1, 0, 0, 0, 0, 0, 0, 2,
  2, 2, 2, 2, 2, 2, 4, 4, 2, 1, 2, 0, 0, 2, 2, 0, 0, -1, 3,
  2, 2, 4, 4, 0
];

// index = opcode
const opcodeMnemonics = [
  'nop', 'aconst_null', 'iconst_m1', 'iconst_0', 'iconst_1', 'iconst_2', 'iconst_3', 'iconst_4', 'iconst_5', 'lconst_0',
  'lconst_1', 'fconst_0', 'fconst_1', 'fconst_2', 'dconst_0', 'dconst_1', 'bipush', 'sipush', 'ldc', 'ldc_w',
  'ldc2_w', 'iload', 'lload', 'fload', 'dload', 'aload', 'iload_0', 'iload_1', 'iload_2', 'iload_3',
  'lload_0', 'lload_1', 'lload_2', 'lload_3', 'fload_0', 'fload_1', 'fload_2', 'fload_3', 'dload_0', 'dload_1',
  'dload_2', 'dload_3', 'aload_0', 'aload_1', 'aload_2', 'aload_3', 'iaload', 'laload', 'faload', 'daload',
  'aaload', 'baload', 'caload', 'saload', 'istore', 'lstore', 'fstore', 'dstore', 'astore', 'istore_0',
  'istore_1', 'istore_2', 'istore_3', 'lstore_0', 'lstore_1', 'lstore_2', 'lstore_3', 'fstore_0', 'fstore_1', 'fstore_2',
  'fstore_3', 'dstore_0', 'dstore_1', 'dstore_2', 'dstore_3', 'astore_0', 'astore_1', 'astore_2', 'astore_3', 'iastore',
  'lastore', 'fastore', 'dastore', 'aastore', 'bastore', 'castore', 'sastore', 'pop', 'pop2', 'dup',  'dup_x1', 'dup_x2',
  'dup2', 'dup2_x1', 'dup2_x2', 'swap', 'iadd', 'ladd', 'fadd', 'dadd',  'isub', 'lsub', 'fsub', 'dsub', 'imul', 'lmul', 'fmul',
  'dmul', 'idiv', 'ldiv',  'fdiv', 'ddiv', 'irem', 'lrem', 'frem', 'drem', 'ineg', 'lneg', 'fneg', 'dneg',  'ishl', 'lshl',
  'ishr', 'lshr', 'iushr', 'lushr', 'iand', 'land', 'ior', 'lor',  'ixor', 'lxor', 'iinc', 'i2l', 'i2f', 'i2d', 'l2i', 'l2f',
  'l2d', 'f2i', 'f2l', 'f2d', 'd2i', 'd2l', 'd2f', 'i2b', 'i2c', 'i2s', 'lcmp', 'fcmpl',  'fcmpg', 'dcmpl',  'dcmpg',
  'ifeq', 'ifne', 'iflt', 'ifge', 'ifgt', 'ifle', 'if_icmpeq',  'if_icmpne', 'if_icmplt', 'if_icmpge',  'if_icmpgt',
  'if_icmple', 'if_acmpeq', 'if_acmpne', 'goto', 'jsr', 'ret',  'tableswitch', 'lookupswitch', 'ireturn',  'lreturn',
  'freturn', 'dreturn', 'areturn', 'return', 'getstatic', 'putstatic', 'getfield', 'putfield',  'invokevirtual',
  'invokespecial', 'invokestatic', 'invokeinterface', 'invokedynamic', 'new', 'newarray', 'anewarray',  'arraylength',
  'athrow', 'checkcast', 'instanceof', 'monitorenter', 'monitorexit', 'wide', 'multianewarray', 'ifnull', 'ifnonnull',
  'goto_w', 'jsr_w', 'breakpoint'
];

class Instruction {
  constructor(opcode, operands, bytecodeOffset) {
    if (typeof opcode !== 'number') throw TypeError('opcode must be a number');
    if (!Array.isArray(operands)) throw TypeError('operands must be an array');

    this.opcode = opcode;
    this.operands = operands;
    this.bytecodeOffset = bytecodeOffset;
  }

  toString() {
    const opcodeMnemonic = opcodeMnemonics[this.opcode] ||
      (this.opcode === 0xFE ? 'impdep1': this.opcode === 0xFF ? 'impdep2' : undefined);
    return `Instruction { opcode: ${opcodeMnemonic}, operands: [${this.operands}] }`
  }
}

class InstructionParser {
  /**
   * Converts Instruction objects into raw bytecode.
   *
   * @param {Instruction[]} instruction - Instructions to convert.
   * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
   * @returns {Number[]}
   */
  static toBytecode(instructions) {
    if (!Array.isArray(instructions)) {
      throw TypeError('instructions must be an array.');
    }

    const bytecode = [];

    for (const {opcode, operands} of instructions) {
      bytecode.push(opcode);

      if (opcode === Opcode.TABLESWITCH || opcode === Opcode.LOOKUPSWITCH) {
        let padding = (bytecode.length % 4) ? 4 - (bytecode.length % 4) : 0;
        while (padding-- > 0) {
          bytecode.push(0);
        }
      }

      // We assume we are given valid operands
      bytecode.push(...operands);
    }

    return bytecode;
  }

  /**
   * Converts raw bytecode into Instruction objects.
   *
   * @param {number[]} bytecode - An array of bytes containing the jvm bytecode.
   * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
   * @returns {Instruction[]}
   */
  static fromBytecode(bytecode) {
    if (!Array.isArray(bytecode)) {
      throw TypeError('bytecode must be an array of bytes.');
    }

    const instructions = [];
    let offset = 0;

    while (offset < bytecode.length) {
      const bytecodeOffset = offset;
      const opcode = bytecode[offset++];

      let numOperandBytes;
      switch (opcode) {
        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lookupswitch
        case Opcode.LOOKUPSWITCH: {
          const padding = (offset % 4) ? 4 - (offset % 4) : 0;
          offset += padding; // Skip padding

          const npairs = (bytecode[offset+4] << 24) | (bytecode[offset+5] << 16) |
                         (bytecode[offset+6] << 8)  | (bytecode[offset+7]);

          numOperandBytes = 8 + (npairs * 8);
          break;
        }

        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.tableswitch
        case Opcode.TABLESWITCH: {
          const padding = (offset % 4) ? 4 - (offset % 4) : 0;
          offset += padding; // Skip padding

          const low =  (bytecode[offset+4] << 24) | (bytecode[offset+5] << 16) |
                       (bytecode[offset+6] << 8 ) | (bytecode[offset+7]);
          const high = (bytecode[offset+8] << 24) | (bytecode[offset+9] << 16) |
                       (bytecode[offset+10] << 8) | (bytecode[offset+11]);
          const numJumpOffsets = (high - low) + 1;

          numOperandBytes = (3 * 4) + (numJumpOffsets * 4);
          break;
        }

        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.wide
        case Opcode.WIDE:
          numOperandBytes = bytecode[offset] === Opcode.IINC ? 5 : 3;
          break;

        default:
          numOperandBytes = opcodeOperandCount[opcode];
          if (numOperandBytes === undefined) {
            throw Error(`Unexpected opcode: ${opcode}`);
          }
          break;
      }

      const operands = bytecode.slice(offset, offset + numOperandBytes);
      const instruction = new Instruction(opcode, operands, bytecodeOffset);

      instructions.push(instruction);
      offset += numOperandBytes;
    }
    return instructions;
  }
}

export {
  Instruction,
  InstructionParser
};
 