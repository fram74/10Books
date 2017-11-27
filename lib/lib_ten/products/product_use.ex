defmodule LibTen.Products.ProductUse do
  use Ecto.Schema

  import Ecto.Changeset

  alias LibTen.Accounts.User
  alias LibTen.Products.{Product, ProductUse}

  schema "product_uses" do
    field :ended_at, :naive_datetime
    belongs_to :product, Product
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(%ProductUse{} = product_use, attrs) do
    product_use
    |> cast(attrs, [:ended_at, :user_id, :product_id])
    |> unique_constraint(:product_id,
      name: :product_uses_product_id_index,
      message: "Already in use"
    )
  end
end
