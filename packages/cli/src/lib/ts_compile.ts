import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * 编译 TS
 */
export class TsCompile {

    /**
     * formatHost
     */
    static formatHost: ts.FormatDiagnosticsHost = {
        getCanonicalFileName: path => path,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
    };

    /**
     * TS 诊断报告
     * build 过程
     * @param diagnostics
     */
    reportDiagnostics(diagnostics: (ts.Diagnostic | undefined)[]): void {
        diagnostics.forEach(diagnostic => {
            let message = "Error";
            if (diagnostic && diagnostic?.file && diagnostic.start !== undefined) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                message += ` ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
            }
            message += ": " + ts.flattenDiagnosticMessageText(diagnostic?.messageText??'', '\n');
            console.log(message);
        });
    }

    /**
     * TS 诊断报告
     * watch 过程
     * @param diagnostic
     */
    reportDiagnostic(diagnostic: ts.Diagnostic) {
        console.error(chalk.yellow(`[Tiger][Server]: `) + chalk.red("Error"), diagnostic.code, ":", ts.flattenDiagnosticMessageText( diagnostic.messageText, TsCompile.formatHost.getNewLine()));
    }

    /**
     * 监听状态报告
     * @param diagnostic
     */
    reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
        console.info(chalk.yellow(`[Tiger][Server]: `) + ts.formatDiagnostic(diagnostic, TsCompile.formatHost));
    }

    /**
     * 读取 tsconfig 配置文件
     * @param configFileName
     * @returns
     */
    readConfigFile(configFileName: string) {
        // Read config file
        const configFileText = fs.readFileSync(configFileName).toString();
        // Parse JSON, after removing comments. Just fancier JSON.parse
        const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
        const configObject = result.config;
        if (!configObject) {
            this.reportDiagnostics([result.error]);
            process.exit(1);
        }
        // Extract config infromation
        const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
        if (configParseResult.errors.length > 0) {
            this.reportDiagnostics(configParseResult.errors);
            process.exit(1);
        }
        return configParseResult;
    }

    /**
     * 编译
     * @param configFileName
     * @param callback
     */
    async compile(configFileName: string, callback?: (config: ts.ParsedCommandLine, exitCode: 0 | 1) => any) {
        // 解析 tsconfig
        const config = this.readConfigFile(configFileName);
        // 编译
        const program = ts.createProgram(config.fileNames, config.options);
        const emitResult = program.emit();
        // 报告错误
        this.reportDiagnostics(ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
        // 退出
        const exitCode = emitResult.emitSkipped ? 1 : 0;
        callback && await callback(config, exitCode);
    }

    /**
     * 监听
     * @param configFileName
     */
    watch(configFileName: string) {
        const config = this.readConfigFile(configFileName);
        const host = ts.createWatchCompilerHost(
            config.fileNames,
            config.options,
            ts.sys,
            ts.createSemanticDiagnosticsBuilderProgram,
            this.reportDiagnostic,
            this.reportWatchStatusChanged
        );
        ts.createWatchProgram(host);
    }
}