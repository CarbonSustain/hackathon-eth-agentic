package main

import (
	"context"
	"fmt"
	"log"
	"math/big"

	"github.com/brevis-network/brevis-sdk/sdk"
	"github.com/ethereum/go-ethereum/common"
)

type AppCircuit struct {
	EmissionsData *big.Int
}

var _ sdk.AppCircuit = &AppCircuit{}

func (c *AppCircuit) Allocate() (maxReceipts, maxStorage, maxTransactions int) {
	return 0, 32, 0 
}

func (c *AppCircuit) Define(api *sdk.CircuitAPI, in sdk.DataInput) error {
	slots := sdk.NewDataStream(api, in.StorageSlots)
	expectedEmission := sdk.ConstUint248(c.EmissionsData.Uint64()) 

	sdk.AssertEach(slots, func(slot sdk.StorageSlot) sdk.Uint248 {
		emissionValue := api.ToUint248(slot.Value)
		return api.Uint248.IsEqual(emissionValue, expectedEmission)
	})

	emissions := sdk.Map(slots, func(slot sdk.StorageSlot) sdk.Uint248 {
		return api.ToUint248(slot.Value)
	})
	totalEmissions := sdk.Sum(emissions)

	api.OutputUint(248, totalEmissions)

	return nil
}

func main() {
	rpcURL := "https://sepolia.drpc.org"
	outputDir := "./brevis-output"
	app, err := sdk.NewBrevisApp(11155111, rpcURL, outputDir)
	if err != nil {
		log.Fatalf("Error initializing BrevisApp: %v", err)
	}

	estimatedEmissions := big.NewInt(10000) // Example emissions
	circuit := &AppCircuit{EmissionsData: estimatedEmissions}

	circuitInput, err := app.BuildCircuitInput(circuit)
	if err != nil {
		log.Fatalf("Error building circuit input: %v", err)
	}

	outDir := "./brevis-circuit"
	srsDir := "./brevis-srs"
	compiledCircuit, pk, vk, _, err := sdk.Compile(circuit, outDir, srsDir, app)
	if err != nil {
		log.Fatalf("Error compiling circuit: %v", err)
	}

	witness, _, err := sdk.NewFullWitness(circuit, circuitInput)
	if err != nil {
		log.Fatalf("Error generating witness: %v", err)
	}

	proof, err := sdk.Prove(compiledCircuit, pk, witness)
	if err != nil {
		log.Fatalf("Error generating proof: %v", err)
	}

	tokenAddress := common.HexToAddress("0xbd2F3813637Ed399D5ddBC2307D3bf4Ab1695B48")
	refundAddress := common.HexToAddress("0x788997cD5b9feAc56d4928539Dc21C637C61E69a")

	_, requestId, feeValue, _, err := app.PrepareRequest(
		vk, witness, 11155111, 11155111, refundAddress, tokenAddress, 500000, nil, "",
	)
	if err != nil {
		log.Fatalf("Error preparing request: %v", err)
	}

	fmt.Printf("Request prepared. Request ID: %s, Fee: %d\n", requestId.Hex(), feeValue)

	err = app.SubmitProof(proof)
	if err != nil {
		log.Fatalf("Error submitting proof: %v", err)
	}

	tx, err := app.WaitFinalProofSubmitted(context.Background())
	if err != nil {
		log.Fatalf("Error waiting for proof submission: %v", err)
	}

	fmt.Printf("Proof successfully submitted! Transaction: %s\n", tx.Hex())
}
