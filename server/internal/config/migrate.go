package config

import (
	"database/sql"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
)

// RunMigrations migrationsディレクトリ内の.up.sqlファイルを順番に実行
// dbTypeに応じてディレクトリを切り替え（sqlite: migrations_sqlite, postgres: migrations_postgres）
func RunMigrations(db *sql.DB, dbType string) error {
	var migrationsPath string
	if dbType == "sqlite" {
		migrationsPath = "./migrations_sqlite"
	} else {
		migrationsPath = "./migrations_postgres"
	}

	// migrationsディレクトリが存在するか確認
	if _, err := os.Stat(migrationsPath); os.IsNotExist(err) {
		log.Printf("No %s migrations directory found, skipping migrations", dbType)
		return nil
	}

	// .up.sqlファイルを取得してソート
	var migrationFiles []string
	err := filepath.WalkDir(migrationsPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && filepath.Ext(path) == ".sql" && filepath.Base(path) != filepath.Base(migrationsPath) {
			// .up.sqlファイルのみを対象
			if len(filepath.Base(path)) > 7 && filepath.Base(path)[len(filepath.Base(path))-7:] == ".up.sql" {
				migrationFiles = append(migrationFiles, path)
			}
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	sort.Strings(migrationFiles)

	// 各マイグレーションファイルを実行
	for _, file := range migrationFiles {
		log.Printf("Running migration: %s", filepath.Base(file))
		
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file, err)
		}

		_, err = db.Exec(string(content))
		if err != nil {
			// すでに存在するテーブルのエラーは無視
			log.Printf("Migration %s: %v (continuing...)", filepath.Base(file), err)
			continue
		}
		
		log.Printf("Migration %s completed successfully", filepath.Base(file))
	}

	log.Println("All migrations completed")
	return nil
}

// RunSeeds seedsディレクトリ内のSQLファイルを実行
// dbTypeに応じてディレクトリを切り替え（sqlite: migrations_sqlite/seeds, postgres: migrations_postgres/seeds）
func RunSeeds(db *sql.DB, dbType string) error {
	var seedsPath string
	if dbType == "sqlite" {
		seedsPath = "./migrations_sqlite/seeds"
	} else {
		seedsPath = "./migrations_postgres/seeds"
	}

	// seedsディレクトリが存在するか確認
	if _, err := os.Stat(seedsPath); os.IsNotExist(err) {
		log.Printf("No %s seeds directory found, skipping seeds", dbType)
		return nil
	}

	// .sqlファイルを取得してソート
	var seedFiles []string
	err := filepath.WalkDir(seedsPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() && filepath.Ext(path) == ".sql" {
			seedFiles = append(seedFiles, path)
		}
		return nil
	})
	if err != nil {
		return fmt.Errorf("failed to read seeds directory: %w", err)
	}

	sort.Strings(seedFiles)

	// 各シードファイルを実行
	for _, file := range seedFiles {
		log.Printf("Running seed: %s", filepath.Base(file))
		
		content, err := os.ReadFile(file)
		if err != nil {
			return fmt.Errorf("failed to read seed file %s: %w", file, err)
		}

		_, err = db.Exec(string(content))
		if err != nil {
			log.Printf("Seed %s: %v (continuing...)", filepath.Base(file), err)
			continue
		}
		
		log.Printf("Seed %s completed successfully", filepath.Base(file))
	}

	log.Println("All seeds completed")
	return nil
}
