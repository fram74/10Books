defmodule LibTen.Repo.Migrations.CreateProductRatings do
  use Ecto.Migration

  def change do
    create table(:product_ratings) do
      add :product_id, references(:products, on_delete: :nothing), null: false
      add :user_id, references(:users, on_delete: :nothing), null: false
      add :rating, :float

      timestamps()
    end

    create unique_index(:product_ratings, [:product_id, :user_id])
    create index(:product_ratings, [:product_id])
  end
end
